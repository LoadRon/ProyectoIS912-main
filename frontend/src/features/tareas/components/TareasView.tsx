// frontend/src/features/tareas/components/TareasView.tsx
import { useState, useEffect } from 'react'
import type { Tarea } from '../types/tarea.types'
import type { Proyecto } from '../../proyectos/types/proyecto.types'
import { obtenerTareasAsync, eliminarTareaAsync } from '../api/tareasApi'
import { obtenerProyectosAsync } from '../../proyectos/api/proyectosApi'
import { extraerMensajeErrorBackend } from '../../../shared/api/apiClient'
import { TareaCard } from './TareaCard'
import { CrearTareaForm } from './CrearTareaForm'

export function TareasView() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [errorRed, setErrorRed] = useState<string | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState<string>('')
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false)

  useEffect(() => {
    // Los proyectos se necesitan para el <select> de la FK proyecto_id y para mostrar su nombre
    Promise.all([obtenerTareasAsync(), obtenerProyectosAsync()])
      .then(([tareasDesdePostgres, proyectosDesdePostgres]) => {
        setTareas(tareasDesdePostgres)
        setProyectos(proyectosDesdePostgres)
        setErrorRed(null)
      })
      .catch((error) => {
        console.error('Auditoría de Error en la Petición HTTP:', error)
        setErrorRed(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  // POST: Actualización Inmutable en el Heap usando Spread Operator [...]
  const manejarTareaCreada = (nuevaTareaDesdeBD: Tarea) => {
    setTareas((tareasActuales) => [...tareasActuales, nuevaTareaDesdeBD])
    setMostrarFormulario(false)
  }

  // DELETE: Si .NET confirma (HTTP 204), removemos el registro del Heap con .filter()
  const manejarEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return

    try {
      setErrorEliminar(null)
      await eliminarTareaAsync(id)
      setTareas((tareasActuales) => tareasActuales.filter((tarea) => tarea.id !== id))
    } catch (error) {
      console.error('🚨 Rechazo reportado por el Backend .NET:', error)
      setErrorEliminar(extraerMensajeErrorBackend(error))
    }
  }

  const tareasFiltradas = tareas.filter((tarea) =>
    tarea.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Tareas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Conectado en tiempo real vía HTTP/CORS con la tabla <code className="text-indigo-400 font-mono">tareas</code> de PostgreSQL.
          </p>
        </div>

        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            + Nueva Tarea
          </button>
        )}
      </div>

      {/* Renderizado condicional del Formulario POST */}
      {mostrarFormulario && (
        <CrearTareaForm
          proyectos={proyectos}
          onTareaCreada={manejarTareaCreada}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Filtrar tareas provenientes de PostgreSQL..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <span className="text-xs text-slate-400">
          Mostrando <strong className="text-white">{tareasFiltradas.length}</strong> de {tareas.length} registros en BD
        </span>
      </div>

      {/* Rechazo del DELETE reportado por .NET */}
      {errorEliminar && (
        <div className="mb-6 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <span><strong>Respuesta del Backend (.NET):</strong> {errorEliminar}</span>
        </div>
      )}

      {cargando && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-indigo-400 font-semibold animate-pulse text-lg">
            ⏳ Consultando endpoint GET /api/tareas en .NET...
          </p>
        </div>
      )}

      {!cargando && errorRed && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold text-base mb-1">🚨 Error de Comunicación Full-Stack</p>
          <p className="text-slate-300 text-sm">{errorRed}</p>
        </div>
      )}

      {!cargando && !errorRed && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tareasFiltradas.map((tarea) => (
            <TareaCard
              key={tarea.id}
              id={tarea.id}
              titulo={tarea.titulo}
              completada={tarea.completada}
              proyectoId={tarea.proyectoId}
              nombreProyecto={proyectos.find((proyecto) => proyecto.id === tarea.proyectoId)?.nombre ?? '—'}
              onEliminar={manejarEliminar}
            />
          ))}
        </section>
      )}
    </div>
  )
}
