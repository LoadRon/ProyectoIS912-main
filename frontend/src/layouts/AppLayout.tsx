// src/layouts/AppLayout.tsx
import type { ReactNode } from 'react'

export type Vista = 'usuarios' | 'proyectos' | 'tareas'

interface AppLayoutProps {
  vistaActiva: Vista;
  onCambiarVista: (vista: Vista) => void;
  children: ReactNode; // Representa la vista que se inyectará en el área de trabajo central
}

const OPCIONES_MENU: { vista: Vista; icono: string; etiqueta: string }[] = [
  { vista: 'usuarios', icono: '👤', etiqueta: 'Usuarios' },
  { vista: 'proyectos', icono: '📁', etiqueta: 'Proyectos' },
  { vista: 'tareas', icono: '✅', etiqueta: 'Tareas' },
]

export function AppLayout({ vistaActiva, onCambiarVista, children }: AppLayoutProps) {
  const claseOpcion = (vista: Vista) =>
    vista === vistaActiva
      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">

      {/* 1. COLUMNA IZQUIERDA: MENÚ CORPORATIVO (SIDEBAR) */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-950 border-r border-slate-800 justify-between p-5 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
              HF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">HabitForge</span>
          </div>

          <p className="px-3 mb-2 text-xs uppercase tracking-wider text-slate-500">Gestión de Tareas</p>
          <nav className="space-y-2">
            {OPCIONES_MENU.map((opcion) => (
              <button
                key={opcion.vista}
                onClick={() => onCambiarVista(opcion.vista)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${claseOpcion(opcion.vista)}`}
              >
                <span>{opcion.icono}</span> {opcion.etiqueta}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Estado de Seguridad</p>
          <p className="text-sm font-semibold text-amber-400">👤 Modo Invitado</p>
        </div>
      </aside>

      {/* 2. CABECERA MÓVIL (con pestañas de navegación) */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
              HF
            </div>
            <span className="font-bold text-lg text-white">HabitForge</span>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
            👤 Invitado
          </span>
        </div>
        <nav className="grid grid-cols-3 gap-2">
          {OPCIONES_MENU.map((opcion) => (
            <button
              key={opcion.vista}
              onClick={() => onCambiarVista(opcion.vista)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${claseOpcion(opcion.vista)}`}
            >
              <span>{opcion.icono}</span> {opcion.etiqueta}
            </button>
          ))}
        </nav>
      </header>

      {/* 3. ÁREA CENTRAL DE CONTENIDO (Aquí se inyecta cualquier módulo hijo) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
