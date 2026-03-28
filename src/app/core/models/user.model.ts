// Entidad de dominio
export interface User {
    id: string;
    email: string;
    createdAt: string;
}

// DTO para crear un usuario
export interface CreateUserDto {
    email: string;
}
