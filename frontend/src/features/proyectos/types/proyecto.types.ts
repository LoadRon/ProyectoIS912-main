// frontend/src/features/proyectos/types/proyecto.types.ts

// 1. Contrato de Lectura / Salida (Espejo de ProyectoResponseDto en C# -> tabla proyectos)
export interface Proyecto {
    id: number;
    nombre: string;
    usuarioId: number; // FK -> usuarios.id
}

// 2. Contrato de Escritura / Entrada (Payload del POST -> CreateProyectoRequestDto)
export interface CrearProyectoDto {
    nombre: string;
    usuarioId: number;
}
