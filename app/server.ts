import express, { Request, Response, urlencoded } from "express";
import { PrismaClient } from "../node_modules/.prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
// import orders from "../routes/orders"
import products from "../routes/products"
import { extractTenantName } from "./http/middlewares/extractTenantName";

// import { pgMiddleware } from "./http/middlewares/tenantMiddleware";
const routes = require('../routes/index.ts')
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// app.use(pgMiddleware);

app.use(cors<Request>({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

app.use(extractTenantName)


app.get("/health", async (req, res) => {
  try {
    await prisma.$connect(); // Ensure DB connection
    res.send("Database connected.");
  } catch (err) {
    res.status(500).send("Database connection failed.");
  }
});

app.use('/api', routes)
// app.use('/api', orders);
app.use('/api', products);

const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  });
};

start();
