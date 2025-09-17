import express from "express";
import { Database } from "bun:sqlite";
import configDatabase from "./config-database.ts";
import configServer from "./config-server.ts";

const db = new Database("./infra/database.db");
const app = express();

configDatabase(db);
configServer(app, db);

app.listen(3001, () => {
  console.log("🚀 API running at http://localhost:3000");
});
