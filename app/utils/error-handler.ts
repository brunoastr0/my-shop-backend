
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}


class CustomError extends Error {
    statusCode: HttpStatusCode;

    constructor(message: string, name: string, statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

export class MissingTenantError extends CustomError {
    constructor() {
        super("Tenant name is required in headers.", "MissingTenantError", HttpStatusCode.BAD_REQUEST);
    }
}

export class TenantNotFoundError extends CustomError {
    constructor() {
        super("Tenant not found.", "TenantNotFoundError", HttpStatusCode.NOT_FOUND);
    }
}

export class ForbiddenAccessTenant extends CustomError {
    constructor() {
        super("Access forbidden: Tenant mismatch", "ForbiddenAccessTenant", HttpStatusCode.FORBIDDEN);
    }
}

export class InvalidToken extends CustomError {
    constructor() {
        super("Invalid or expired token", "InvalidToken", HttpStatusCode.UNAUTHORIZED);
    }
}

export class AccessTokenMissing extends CustomError {
    constructor() {
        super("Access token missing", "AccessTokenMissing", HttpStatusCode.UNAUTHORIZED);
    }
}


export const Errors = {
    MissingTenantError,
    TenantNotFoundError,
    ForbiddenAccessTenant,
    InvalidToken,
    AccessTokenMissing,
};