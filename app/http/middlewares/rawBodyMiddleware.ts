import { Request, Response, NextFunction } from "express";

export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction) {

    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", () => {
        req.rawBody = data; // Attach the raw body to the request object
        next();
    });
}