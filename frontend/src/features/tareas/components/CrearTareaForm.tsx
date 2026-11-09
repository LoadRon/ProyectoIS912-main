// frontend/src/features/tareas/components/CrearTareaForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Tarea } from '../types/tarea.types'
import type { Proyecto } from '../../proyectos/types/proyecto.types'
import { crearTareaAsync } from '../api/tareasApi'
import { extraerMensajeErrorBackend } from '../../../shared/api/apiClient'
import { crearTareaSchema, type CrearTareaSchemaType } from '../schemas/tarea.schema'

interface CrearTareaFormProps {
    proyectos: Proyecto[]; // Opciones para la llave foránea proyecto_id
    onTareaCreada: (nuevaTarea: Tarea) => void;
    onCancelar: () => void;
}

export function CrearTareaForm({ proyectos, onTareaCreada, onCancelar }: CrearTareaFormProps) {
    // Estado para almacenar el mensaje exacto que devuelva .NET si rechaza la petición
    const [errorServidor, setErrorServidor] = useState<string | null>(null)

    // --- CONEXIÓN DEL ARTEFACTO DE VALIDACIÓN SINTÁCTICA EN TIEMPO REAL ---
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CrearTareaSchemaType>({
        resolver: zodResolver(crearTareaSchema),
        mode: 'onChange', // Evalúa cada tecla mientras el usuario escribe
        defaultValues: {
            titulo: '',
            proyectoId: 0,
        },
    })

    // Solo se ejecuta cuando el Artefacto Zod garantiza que el dato está 100% limpio
    const procesarEnvioLimpio = async (datosValidados: CrearTareaSchemaType) => {
        try {
            setErrorServidor(null)

            const tareaCreadaEnBd = await crearTareaAsync(datosValidados)

            reset()
            onTareaCreada(tareaCreadaEnBd)
        } catch (error) {
            // Si .NET rechaza la operación (ej. el proyecto ya no existe en BD),
            // extraemos y mostramos el mensaje exacto enviado por el Backend
            const mensajeExactoDeNet = extraerMensajeErrorBackend(error)
            console.error('🚨 Rechazo reportado por el Backend .NET:', error)
            setErrorServidor(mensajeExactoDeNet)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(procesarEnvioLimpio)}
            className="bg-slate-800/90 border border-indigo-500/40 rounded-xl p-5 mb-8 shadow-lg"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400">✨</span> Registrar Nueva Tarea
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    🛡️ Esquema Zod + FluentValidation .NET
                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Ej. Diseñar diagramas Entidad-Relación en 3FN..."
                        disabled={isSubmitting}
                        autoFocus
                        {...register('titulo', {
                            onChange: () => {
                                if (errorServidor) setErrorServidor(null)
                            },
                        })}
                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.titulo
                                ? 'border-amber-500 focus:border-amber-400'
                                : errorServidor
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                    />
                </div>

                <div className="flex-1">
                    {/* valueAsNumber: el <select> entrega un número para la FK proyecto_id */}
                    <select
                        disabled={isSubmitting}
                        {...register('proyectoId', {
                            valueAsNumber: true,
                            onChange: () => {
                                if (errorServidor) setErrorServidor(null)
                            },
                        })}
                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                            errors.proyectoId
                                ? 'border-amber-500 focus:border-amber-400'
                                : errorServidor
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                    >
                        <option value={0}>Selecciona el proyecto...</option>
                        {proyectos.map((proyecto) => (
                            <option key={proyecto.id} value={proyecto.id}>
                                {proyecto.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 self-start">
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '⏳ Guardando en BD...' : '💾 Guardar en PostgreSQL'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={isSubmitting}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>

            {/* 1. Retroalimentación Sintáctica Instantánea (Zod MIENTRAS ESCRIBE) */}
            {errors.titulo && (
                <p className="text-amber-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                    <span>⚡</span> <strong>Validación en vivo:</strong> {errors.titulo.message}
                </p>
            )}
            {errors.proyectoId && (
                <p className="text-amber-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                    <span>⚡</span> <strong>Validación en vivo:</strong> {errors.proyectoId.message}
                </p>
            )}

            {/* 2. Retroalimentación del Servidor (Mensaje EXACTO devuelto por .NET FluentValidation) */}
            {errorServidor && (
                <div className="mt-3 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <span><strong>Respuesta del Backend (.NET):</strong> {errorServidor}</span>
                </div>
            )}
        </form>
    )
}
