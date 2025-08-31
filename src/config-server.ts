import express, { type Express } from "express";
import cors from "cors";

export default (app: Express) => {
  app.use(express.json());

  // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(cors());
};
