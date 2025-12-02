import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

export const poolConnection = mysql.createPool({
    host: "myapp-database.cnqaak2s2fdr.eu-north-1.rds.amazonaws.com",
    user: "admin",
    password: "blossoms.sos",
    database: "BlossomsDB",
    port: 3306,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
