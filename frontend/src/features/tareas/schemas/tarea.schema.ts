// frontend/src/features/tareas/schemas/tarea.schema.ts
import { z } from 'zod'

// Espejo de CreateTareaValidator (FluentValidation en .NET)
export const crearTareaSchema = z.object({
    titulo: z
        .string()
        .trim()
        .min(1, 'El título de la tarea no puede estar vacío.')
        .min(3, 'La tarea debe tener al menos 3 caracteres.')
        .max(150, 'El título no puede superar los 150 caracteres.')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,()#:¿?¡!-]+$/,
            'La tarea contiene caracteres especiales no permitidos.'
        ),
    // FK -> proyectos.id (el <select> se registra con valueAsNumber)
    proyectoId: z
        .number({ error: 'Debe seleccionar un proyecto válido.' })
        .int()
        .positive('Debe seleccionar un proyecto válido.'),
})

export type CrearTareaSchemaType = z.infer<typeof crearTareaSchema>
