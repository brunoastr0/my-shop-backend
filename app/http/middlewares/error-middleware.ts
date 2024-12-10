import { Request, Response, NextFunction } from 'express';
import formatPrismaError from '../../utils/format-prisma-error'; // Path to the formatter
interface ErrorResponse {
    statusCode: number;
    errorType: string;
    message: string;
}
const errorMiddleware = (err: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
    const errorResponse = formatPrismaError(err);
    res.status(errorResponse.statusCode).json({
        error: {
            message: errorResponse.message,
        }
    });
    return;
};

export default errorMiddleware;
