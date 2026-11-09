// frontend/src/features/tareas/api/tareasApi.ts
import { apiClient } from '../../../shared/api/apiClient'
import type { Tarea, CrearTareaDto } from '../types/tarea.types'

// 1. Endpoint GET: Obtener todas las tareas
export const obtenerTareasAsync = async (): Promise<Tarea[]> => {
    const respuesta = await apiClient.get<Tarea[]>('/tareas')

    if (!Array.isArray(respuesta.data)) {
        throw new Error('La respuesta recibida no es un arreglo JSON válido.')
    }

    return respuesta.data
}

// 2. Endpoint POST: Insertar una nueva tarea en PostgreSQL
export const crearTareaAsync = async (nuevaTarea: CrearTareaDto): Promise<Tarea> => {
    const respuesta = await apiClient.post<Tarea>('/tareas', nuevaTarea)
    return respuesta.data
}

// 3. Endpoint DELETE: Eliminar una tarea de PostgreSQL (HTTP 204 No Content)
export const eliminarTareaAsync = async (id: number): Promise<void> => {
    await apiClient.delete(`/tareas/${id}`)
}
