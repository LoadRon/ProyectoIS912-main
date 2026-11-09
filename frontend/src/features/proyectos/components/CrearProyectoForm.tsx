// frontend/src/features/proyectos/components/CrearProyectoForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Proyecto } from '../types/proyecto.types'
import type { Usuario } from '../../usuarios/types/usuario.types'
import { crearProyectoAsync } from '../api/proyectosApi'
import { extraerMensajeErrorBackend } from '../../../shared/api/apiClient'
import { crearProyectoSchema, type CrearProyectoSchemaType } from '../schemas/proyecto.schema'

interface CrearProyectoFormProps {
    usuarios: Usuario[]; // Opciones para la llave foránea usuario_id
    onProyectoCreado: (nuevoProyecto: Proyecto) => void;
    onCancelar: () => void;
}

export function CrearProyectoForm({ usuarios, onProyectoCreado, onCancelar }: CrearProyectoFormProps) {
    // Estado para almacenar el mensaje exacto que devuelva .NET si rechaza la petición
    const [errorServidor, setErrorServidor] = useState<string | null>(null)

    // --- CONEXIÓN DEL ARTEFACTO DE VALIDACIÓN SINTÁCTICA EN TIEMPO REAL ---
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CrearProyectoSchemaType>({
        resolver: zodResolver(crearProyectoSchema),
        mode: 'onChange', // Evalúa cada tecla mientras el usuario escribe
        defaultValues: {
            nombre: '',
            usuarioId: 0,
        },
    })

    // Solo se ejecuta cuando el Artefacto Zod garantiza que el dato está 100% limpio
    const procesarEnvioLimpio = async (datosValidados: CrearProyectoSchemaType) => {
        try {
            setErrorServidor(null)

            const proyectoCreadoEnBd = await crearProyectoAsync(datosValidados)

            reset()
            onProyectoCreado(proyectoCreadoEnBd)
        } catch (error) {
            // Si .NET rechaza la operación (ej. el usuario ya no existe en BD),
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
                    <span className="text-indigo-400">✨</span> Registrar Nuevo Proyecto
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    🛡️ Esquema Zod + FluentValidation .NET
                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Ej. Proyecto de Clase IS912..."
                        disabled={isSubmitting}
                        autoFocus
                        {...register('nombre', {
                            onChange: () => {
                                if (errorServidor) setErrorServidor(null)
                            },
                        })}
                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.nombre
                                ? 'border-amber-500 focus:border-amber-400'
                                : errorServidor
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                    />
                </div>

                <div className="flex-1">
                    {/* valueAsNumber: el <select> entrega un número para la FK usuario_id */}
                    <select
                        disabled={isSubmitting}
                        {...register('usuarioId', {
                            valueAsNumber: true,
                            onChange: () => {
                                if (errorServidor) setErrorServidor(null)
                            },
                        })}
                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                            errors.usuarioId
                                ? 'border-amber-500 focus:border-amber-400'
                                : errorServidor
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                    >
                        <option value={0}>Selecciona el usuario dueño...</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre}
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
            {errors.nombre && (
                <p className="text-amber-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                    <span>⚡</span> <strong>Validación en vivo:</strong> {errors.nombre.message}
                </p>
            )}
            {errors.usuarioId && (
                <p className="text-amber-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                    <span>⚡</span> <strong>Validación en vivo:</strong> {errors.usuarioId.message}
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
