// frontend/src/features/proyectos/api/proyectosApi.ts
import { apiClient } from '../../../shared/api/apiClient'
import type { Proyecto, CrearProyectoDto } from '../types/proyecto.types'

// 1. Endpoint GET: Obtener todos los proyectos
export const obtenerProyectosAsync = async (): Promise<Proyecto[]> => {
    const respuesta = await apiClient.get<Proyecto[]>('/proyectos')

    if (!Array.isArray(respuesta.data)) {
        throw new Error('La respuesta recibida no es un arreglo JSON válido.')
    }

    return respuesta.data
}

// 2. Endpoint POST: Insertar un nuevo proyecto en PostgreSQL
export const crearProyectoAsync = async (nuevoProyecto: CrearProyectoDto): Promise<Proyecto> => {
    const respuesta = await apiClient.post<Proyecto>('/proyectos', nuevoProyecto)
    return respuesta.data
}

// 3. Endpoint DELETE: Eliminar un proyecto (HTTP 204, borra en cascada sus tareas)
export const eliminarProyectoAsync = async (id: number): Promise<void> => {
    await apiClient.delete(`/proyectos/${id}`)
}
