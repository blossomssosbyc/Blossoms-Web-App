import { randomUUID } from "crypto";
import { db } from "./db";
import {
  registrations,
  schoolOfSciences,
  schoolOfSocialSciences,
  schoolOfBusiness,
  schoolOfCommerce,
  schoolOfPsychology,
  winnersList,
  pointsTable, // ADD THIS IMPORT
  type User,
  type InsertUser,
} from "@shared/schema";
import { eq } from "drizzle-orm";

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
  verified: boolean;
  status: "pending" | "approved" | "rejected";
};

export interface IStorage {
  getUser(id: string): Promise<ServerUser | undefined>;
  getUserByUsername(username: string): Promise<ServerUser | undefined>;
  createUser(user: ServerInsertUser): Promise<ServerUser>;
  setOtpForUser(id: string, otp: string): Promise<void>;
  verifyOtp(id: string, otp: string): Promise<boolean>;
  getPendingUsers(): Promise<ServerUser[]>;
  approveUser(id: string): Promise<ServerUser | undefined>;
  rejectUser(id: string): Promise<ServerUser | undefined>;

  // AWS RDS data methods
  getRegistrations(): Promise<any[]>;
  getSchoolOfSciences(): Promise<any[]>;
  getSchoolOfSocialSciences(): Promise<any[]>;
  getSchoolOfBusiness(): Promise<any[]>;
  getSchoolOfCommerce(): Promise<any[]>;
  getSchoolOfPsychology(): Promise<any[]>;
  getWinners(): Promise<any[]>;
  getPoints(): Promise<any[]>; // ADD THIS LINE
}

export class DatabaseStorage implements IStorage {
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
      user.otp = undefined;
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

  // AWS RDS Data Fetching Methods
  async getRegistrations(): Promise<any[]> {
    return await db.select().from(registrations);
  }

  async getSchoolOfSciences(): Promise<any[]> {
    return await db.select().from(schoolOfSciences);
  }

  async getSchoolOfSocialSciences(): Promise<any[]> {
    return await db.select().from(schoolOfSocialSciences);
  }

  async getSchoolOfBusiness(): Promise<any[]> {
    return await db.select().from(schoolOfBusiness);
  }

  async getSchoolOfCommerce(): Promise<any[]> {
    return await db.select().from(schoolOfCommerce);
  }

  async getSchoolOfPsychology(): Promise<any[]> {
    return await db.select().from(schoolOfPsychology);
  }

  async getWinners(): Promise<any[]> {
    return await db.select().from(winnersList);
  }

  // NEW: Points Table Method
  async getPoints(): Promise<any[]> {
    return await db.select().from(pointsTable);
  }
}

export const storage = new DatabaseStorage();
