// frontend/src/features/proyectos/schemas/proyecto.schema.ts
import { z } from 'zod'

// Espejo de CreateProyectoValidator (FluentValidation en .NET)
export const crearProyectoSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, 'El nombre del proyecto no puede estar vacío.')
        .min(3, 'El proyecto debe tener al menos 3 caracteres.')
        .max(100, 'El nombre del proyecto no puede superar los 100 caracteres.')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,()#:-]+$/,
            'El proyecto contiene caracteres especiales no permitidos.'
        ),
    // El <select> se registra con valueAsNumber, por eso validamos un número (FK -> usuarios.id)
    usuarioId: z
        .number({ error: 'Debe seleccionar un usuario válido.' })
        .int()
        .positive('Debe seleccionar un usuario válido.'),
})

export type CrearProyectoSchemaType = z.infer<typeof crearProyectoSchema>
