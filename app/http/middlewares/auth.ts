import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Add the user to the request object
        next();
    });
};
