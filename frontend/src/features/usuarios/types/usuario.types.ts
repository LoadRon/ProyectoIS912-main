// frontend/src/features/usuarios/types/usuario.types.ts

// 1. Contrato de Lectura / Salida (Espejo de UsuarioResponseDto en C# -> tabla usuarios)
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

// 2. Contrato de Escritura / Entrada (Payload del POST -> CreateUsuarioRequestDto)
export interface CrearUsuarioDto {
    nombre: string;
    email: string;
}
