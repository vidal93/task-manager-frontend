// Respuesta generica del API
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// Estructura de error del API
export interface ApiError {
    error: string;
    statusCode: number;
}

// Token JWT devuelto al autenticar
export interface AuthToken {
    token: string;
    userId: string;
    email: string;
}
