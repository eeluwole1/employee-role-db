import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import setupSwagger from "./config/swagger";
import corsOptions from "./config/cors";
import { useExpressServer } from "routing-controllers";
import { EmployeeController } from "./api/v1/controllers/employeeController";
import { RoleController } from "./api/v1/controllers/roleController";
import { clerkMiddleware } from '@clerk/express'

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(clerkMiddleware());

useExpressServer(app, {
  routePrefix: "/api/v1",
  controllers: [EmployeeController, RoleController],
  cors: corsOptions,
  defaultErrorHandler: false,
});

dotenv.config();

setupSwagger(app);

app.get("/", (_req, res) => {
  res.send("Got response from backend!");
});

export default app;
