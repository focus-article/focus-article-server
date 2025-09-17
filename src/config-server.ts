import express, { type Express } from "express";
import cors from "cors";
import qs from "qs";

export default (app: Express) => {
  app.use(express.json());

  // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(cors());

  app.set("query parser", (str: string) => qs.parse(str));
};
