import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDirectory = path.join(__dirname, "../logs");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "7d",
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, "warn-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "warn",
            maxFiles: "7d",
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, "info-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "info",
            maxFiles: "7d",
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
        }),
    ],
});

export default logger;
