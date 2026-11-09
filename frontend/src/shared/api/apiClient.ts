// frontend/src/shared/api/apiClient.ts
// Cliente HTTP compartido por los 3 módulos (usuarios, proyectos, tareas)
import axios from 'axios'
import type { FluentValidationError } from '../types/api.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
    console.error('🚨 ERROR CRÍTICO: No se detectó VITE_API_BASE_URL en frontend/.env')
}

// 1. Instancia centralizada de Axios configurada con la variable de entorno (.env)
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 2. Artefacto Extractor de Errores HTTP de .NET (Soporta FluentValidation Array, ProblemDetails y Strings)
export const extraerMensajeErrorBackend = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        // Caso A: El servidor .NET está apagado o el navegador bloqueó por CORS
        if (!error.response) {
            return 'Sin respuesta del servidor (.NET apagado o bloqueo de seguridad CORS en el navegador).'
        }

        const status = error.response.status
        const data = error.response.data

        // Caso B: Arreglo de errores devuelto por FluentValidation en .NET -> [ { propertyName, errorMessage }, ... ]
        if (Array.isArray(data)) {
            const erroresFluent = (data as FluentValidationError[])
                .map((item) => item?.errorMessage)
                .filter((msg): msg is string => typeof msg === 'string' && msg.trim().length > 0)

            if (erroresFluent.length > 0) {
                return `[HTTP ${status}] ${erroresFluent.join(' | ')}`
            }
        }

        // Caso C: El controlador de .NET devolvió un string directo -> BadRequest("Mensaje...")
        if (typeof data === 'string' && data.trim().length > 0) {
            return `[HTTP ${status}] ${data}`
        }

        // Caso D: El servidor devolvió un objeto JSON (ProblemDetails o { error / mensaje })
        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>

            if ('errors' in obj && obj.errors && typeof obj.errors === 'object') {
                const listaErrores = Object.values(obj.errors as Record<string, string[]>).flat()
                if (listaErrores.length > 0) {
                    return `[HTTP ${status}] ${listaErrores.join(' | ')}`
                }
            }

            const mensajeExplicito = obj.error || obj.mensaje || obj.message || obj.detail || obj.title
            if (typeof mensajeExplicito === 'string' && mensajeExplicito.trim().length > 0) {
                return `[HTTP ${status}] ${mensajeExplicito}`
            }
        }

        return `[HTTP ${status}] El servidor .NET rechazó la operación.`
    }

    return error instanceof Error ? error.message : 'Error inesperado en la aplicación.'
}
