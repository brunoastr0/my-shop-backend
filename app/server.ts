import express, { Request, Response } from "express";
import { PrismaClient } from "../node_modules/.prisma/client";
import dotenv from "dotenv";
const routes = require('../routes/index.ts')
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api', routes)


const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();
