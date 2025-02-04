import express, { Request, Response, urlencoded } from "express";
import { PrismaClient } from "../node_modules/.prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

import crypto from "crypto";

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
// app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({ extended: true }))


//routes
app.use('/api', routes)
const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();
