// frontend/src/features/tareas/components/TareaCard.tsx
import type { Tarea } from '../types/tarea.types'

// --- ZONA 1: EL CONTRATO (Tarea + nombre del proyecto + acción DELETE delegada al padre) ---
interface TareaCardProps extends Tarea {
    nombreProyecto: string;
    onEliminar: (id: number) => void;
}

// --- ZONA 2: LA FIRMA ---
export function TareaCard({ id, titulo, completada, proyectoId, nombreProyecto, onEliminar }: TareaCardProps) {

    // --- ZONA 3: EL CEREBRO (LÓGICA) ---
    // (Componente presentacional: la petición DELETE la ejecuta la vista padre)

    // --- ZONA 4: EL RENDERIZADO (APLICANDO DESIGN TOKENS) ---
    return (
        <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-500/20">
                        ID Tarea #{id}
                    </span>
                    <span className={`text-xs font-medium ${completada ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {completada ? '✔ Completada' : '● Pendiente'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                    {titulo}
                </h3>
                <p className="text-sm text-slate-400 mb-5">📁 {nombreProyecto} (proyecto_id: {proyectoId})</p>
            </div>

            <button
                onClick={() => onEliminar(id)}
                className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 text-sm font-medium py-2.5 px-4 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
            >
                🗑️ Eliminar Tarea
            </button>
        </article>
    );
}
