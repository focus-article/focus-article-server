import express from "express";
import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import configDatabase from "./config-database.ts";
import configServer from "./config-server.ts";

const dbPath = "./infra/database.db";

const dirPath = path.dirname(dbPath);
if (!existsSync(dirPath)) {
  mkdirSync(dirPath, { recursive: true });
}
const db = new Database(dbPath);

const app = express();

configDatabase(db);
configServer(app, db);

app.listen(3001, () => {
  console.log("🚀 API running at http://localhost:3001");
});
