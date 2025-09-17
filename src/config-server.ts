import express, { type Express } from "express";
import cors from "cors";
import qs from "qs";
import articlesRouter from "./api/articles/articles.router.ts";
import extractorRouter from "./api/extractor/extractor.router.ts";
import type { Database } from "bun:sqlite";

export default (app: Express, db: Database) => {
  app.use(express.json());

  // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(cors());

  app.set("query parser", (str: string) => qs.parse(str));

  articlesRouter(app, db);
  extractorRouter(app);
};
