import express, { Request, Response, urlencoded } from "express";
import { PrismaClient } from "../node_modules/.prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

import crypto from "crypto";
import logger from "./utils/logger";

// import orders from "../routes/orders"

// import { pgMiddleware } from "./http/middlewares/tenantMiddleware";
const routes = require('./http/routes/index.ts')
dotenv.config();

const app = express();
const prisma = new PrismaClient();


// app.use(pgMiddleware);


app.use(cors<Request>({
  origin: true,
  credentials: true
}));
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`)
})
// app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({ extended: true }))


//routes
app.use('/api', routes)
const start = async () => {
  app.listen(process.env.PORT, () => {
    logger.info(`Server is running at http://${process.env.HOST}:${process.env.PORT}`);

  });
};

start();
