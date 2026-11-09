// frontend/src/shared/components/EstadosConsulta.tsx
// Tarjetas reutilizables para los estados de una consulta HTTP (cargando / error / vacío)

export function EstadoCargando({ mensaje }: { mensaje: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-indigo-400 font-semibold animate-pulse text-lg">⏳ {mensaje}</p>
        </div>
    )
}

export function EstadoErrorRed({ mensaje }: { mensaje: string }) {
    return (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-6 text-center">
            <p className="text-red-400 font-bold text-base mb-1">🚨 Error de Comunicación Full-Stack</p>
            <p className="text-slate-300 text-sm">{mensaje}</p>
        </div>
    )
}

export function EstadoVacio({ mensaje }: { mensaje: string }) {
    return (
        <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-10 text-center">
            <p className="text-slate-400 text-sm">{mensaje}</p>
        </div>
    )
}

// Banner para errores en operaciones (ej. DELETE rechazado por el servidor)
export function BannerErrorOperacion({ mensaje, onCerrar }: { mensaje: string; onCerrar: () => void }) {
    return (
        <div className="mb-6 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span><strong>Respuesta del Backend (.NET):</strong> {mensaje}</span>
            </span>
            <button onClick={onCerrar} className="text-red-300 hover:text-white cursor-pointer" aria-label="Cerrar">
                ✕
            </button>
        </div>
    )
}
