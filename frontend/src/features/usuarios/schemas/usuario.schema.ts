// frontend/src/features/usuarios/schemas/usuario.schema.ts
import { z } from 'zod'

// Espejo de CreateUsuarioValidator (FluentValidation en .NET)
export const crearUsuarioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, 'El nombre del usuario no puede estar vacío.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/, 'El nombre solo puede contener letras y espacios.'),
    email: z
        .string()
        .trim()
        .min(1, 'El email no puede estar vacío.')
        .max(150, 'El email no puede superar los 150 caracteres.')
        .pipe(z.email('El email no tiene un formato válido.')),
})

export type CrearUsuarioSchemaType = z.infer<typeof crearUsuarioSchema>
