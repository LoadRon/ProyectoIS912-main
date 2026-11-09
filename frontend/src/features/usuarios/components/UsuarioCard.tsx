// frontend/src/features/usuarios/components/UsuarioCard.tsx
import type { Usuario } from '../types/usuario.types'

// --- ZONA 1: EL CONTRATO (Usuario + acción DELETE delegada al padre) ---
interface UsuarioCardProps extends Usuario {
    onEliminar: (id: number) => void;
}

// --- ZONA 2: LA FIRMA ---
export function UsuarioCard({ id, nombre, email, onEliminar }: UsuarioCardProps) {

    // --- ZONA 3: EL CEREBRO (LÓGICA) ---
    // (Componente presentacional: la petición DELETE la ejecuta la vista padre)

    // --- ZONA 4: EL RENDERIZADO (APLICANDO DESIGN TOKENS) ---
    return (
        <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-500/20">
                        ID Usuario #{id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">usuarios</span>
                </div>

                <h3 className="text-lg font-bold text-white">
                    {nombre}
                </h3>
                <p className="text-sm text-slate-400 mb-5 break-all">{email}</p>
            </div>

            <button
                onClick={() => onEliminar(id)}
                className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 text-sm font-medium py-2.5 px-4 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
            >
                🗑️ Eliminar Usuario
            </button>
        </article>
    );
}
