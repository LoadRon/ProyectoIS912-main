// frontend/src/features/tareas/types/tarea.types.ts

// 1. Contrato de Lectura / Salida (Espejo de TareaResponseDto en C# -> tabla tareas)
export interface Tarea {
    id: number;
    titulo: string;
    completada: boolean;
    proyectoId: number; // FK -> proyectos.id
}

// 2. Contrato de Escritura / Entrada (Payload del POST -> CreateTareaRequestDto)
//    'completada' no se envía: toda tarea nace pendiente en el servidor
export interface CrearTareaDto {
    titulo: string;
    proyectoId: number;
}
