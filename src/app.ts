import "reflect-metadata";
import "express-async-errors";

import express from "express";
import cors from "cors";

import * as database from "./database";
import "./shared/container";
import { router } from "./routes";
import { AppError } from "./shared/errors/AppError";

class App {
  private app = express();
  constructor(private port: number = 3333) {}

  public async init() {
    await this.setupDatabase();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  public start() {
    this.app.listen(this.port, () =>
      console.log(`Server is running at port ${this.port}`)
    );
  }

  getApp() {
    return this.app;
  }

  private async setupDatabase() {
    await database.connect();
  }

  public async close() {
    await database.close();
  }

  private setupMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private setupRoutes() {
    this.app.use("/api/v1", router);

    this.app.use(
      (
        err: Error,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
          });
        }

        console.error(err);

        return response.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    );
  }

  private setupErrorHandler() {
    this.app.use(
      (
        err: Error,
        request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            message: err.message,
          });
        }

        return response.status(500).json({
          status: "error",
          message: `Internal server error - ${err.message} `,
        });
      }
    );
  }
}

export { App };
