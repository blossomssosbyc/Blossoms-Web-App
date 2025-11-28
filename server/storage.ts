import { randomUUID } from "crypto";

// Server-side in-memory user model for admin flow.
export type ServerInsertUser = {
  username: string;
  password: string;
  email: string;
};

export type ServerUser = {
  id: string;
  username: string;
  password: string;
  email: string;
  otp?: string;
  verified: boolean; // whether the user completed OTP verification
  status: "pending" | "approved" | "rejected"; // admin approval
};

// modify the interface with any CRUD methods you might need
export interface IStorage {
  getUser(id: string): Promise<ServerUser | undefined>;
  getUserByUsername(username: string): Promise<ServerUser | undefined>;
  createUser(user: ServerInsertUser): Promise<ServerUser>;
  setOtpForUser(id: string, otp: string): Promise<void>;
  verifyOtp(id: string, otp: string): Promise<boolean>;
  getPendingUsers(): Promise<ServerUser[]>;
  approveUser(id: string): Promise<ServerUser | undefined>;
  rejectUser(id: string): Promise<ServerUser | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, ServerUser>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<ServerUser | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<ServerUser | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: ServerInsertUser): Promise<ServerUser> {
    const id = randomUUID();
    const user: ServerUser = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      otp: undefined,
      verified: false,
      status: "pending",
    };
    this.users.set(id, user);
    return user;
  }

  async setOtpForUser(id: string, otp: string): Promise<void> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    user.otp = otp;
    this.users.set(id, user);
  }

  async verifyOtp(id: string, otp: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    if (!user.otp) return false;
    const ok = user.otp === otp;
    if (ok) {
      user.verified = true;
      user.otp = undefined; // clear
      this.users.set(id, user);
    }
    return ok;
  }

  async getPendingUsers(): Promise<ServerUser[]> {
    return Array.from(this.users.values()).filter((u) => u.status === "pending");
  }

  async approveUser(id: string): Promise<ServerUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.status = "approved";
    this.users.set(id, user);
    return user;
  }

  async rejectUser(id: string): Promise<ServerUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.status = "rejected";
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
