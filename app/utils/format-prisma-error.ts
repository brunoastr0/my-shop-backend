import { Prisma } from '@prisma/client';

interface ErrorResponse {
    statusCode: number;
    errorType: string;
    message: string;
}

function formatPrismaError(err: unknown): ErrorResponse {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle Prisma known errors, such as unique constraint violations
        if (err.code === 'P2002') {
            const fields = (err.meta?.target as string[])?.join(', ');
            return {
                statusCode: 409, // Conflict for unique constraint
                errorType: 'UniqueConstraintViolation',

                message: `Email already exists`,
            };
        }

        return {
            statusCode: 400, // Bad request for known errors
            errorType: 'PrismaClientKnownRequestError',
            message: err.message,
        };
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return {
            statusCode: 400,
            errorType: 'Validation Error',
            message: err.message,
        };
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
        return {
            statusCode: 500,
            errorType: 'InitializationError',
            message: err.message,
        };
    }

    if (err instanceof Prisma.PrismaClientRustPanicError) {
        return {
            statusCode: 500,
            errorType: 'RustPanic',
            message: 'Prisma engine crashed. Please restart the application.',
        };
    }

    // Handle unknown errors
    return {
        statusCode: 500,
        errorType: 'UnknownError',
        message: (err instanceof Error) ? err.message : 'An unknown error occurred',
    };
}

export default formatPrismaError;
