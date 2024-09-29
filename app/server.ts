import express, { Request, Response } from "express";
import { PrismaClient } from "../node_modules/.prisma/client";
import dotenv from "dotenv";
// import orders from "../routes/orders"
import products from "../routes/products"
// import { pgMiddleware } from "./http/middlewares/tenantMiddleware";
const routes = require('../routes/index.ts')
dotenv.config();

const app = express();
new PrismaClient();

// app.use(pgMiddleware);

app.use(express.json());

app.use('/api', routes)
// app.use('/api', orders);
app.use('/api', products);

const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();
