import type { Express, Request, Response } from "express";
import { Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";

function createMailer() {
  // SMTP configuration should be provided via environment variables.
  // e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const transporter = nodemailer.createTransport({
    host,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  return transporter;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();
  const transporter = createMailer();

  // Register new admin user (app-level user)
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body as {
        username: string;
        email: string;
        password: string;
      };
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) return res.status(400).json({ message: "User exists" });

      const user = await storage.createUser({ username, email, password });

      // generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await storage.setOtpForUser(user.id, otp);

      // send OTP email to user's email if mailer configured
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: "Your Blossoms verification code",
          text: `Your verification code is ${otp}`,
        });
      } else {
        console.log("OTP for", email, "is", otp);
      }

      return res.json({ id: user.id, message: "Registered, otp sent" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Error" });
    }
  });

  // Verify OTP
  router.post("/verify-otp", async (req: Request, res: Response) => {
    try {
      const { id, otp } = req.body as { id: string; otp: string };
      if (!id || !otp) return res.status(400).json({ message: "Missing" });
      const ok = await storage.verifyOtp(id, otp);
      if (!ok) return res.status(400).json({ message: "Invalid OTP" });
      return res.json({ message: "Verified. Waiting for admin approval." });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Error" });
    }
  });

  // Admin: list pending users
  router.get("/admin/pending", async (_req: Request, res: Response) => {
    try {
      const pending = await storage.getPendingUsers();
      // strip sensitive fields
      const data = pending.map((u) => ({ id: u.id, username: u.username, email: u.email, verified: u.verified }));
      return res.json(data);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Error" });
    }
  });

  // Admin: approve user
  router.post("/admin/approve/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const user = await storage.approveUser(id);
      if (!user) return res.status(404).json({ message: "Not found" });

      // send notification email to blossoms.sos.byc@gmail.com
      const notifyTo = "blossoms.sos.byc@gmail.com";
      const subject = `User approved: ${user.username}`;
      const text = `User ${user.username} <${user.email}> has been approved and can now access the data.`;

      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: notifyTo,
          subject,
          text,
        });
      } else {
        console.log("Would notify", notifyTo, "-", text);
      }

      return res.json({ message: "Approved" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Error" });
    }
  });

  // Admin: reject user
  router.post("/admin/reject/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const user = await storage.rejectUser(id);
      if (!user) return res.status(404).json({ message: "Not found" });

      // notify user about rejection (optional)
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: `Your registration was not approved`,
          text: `Hello ${user.username}, your registration was not approved by the admin.`,
        });
      }

      return res.json({ message: "Rejected" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Error" });
    }
  });

  app.use("/api", router);

  const httpServer = createServer(app);

  return httpServer;
}
