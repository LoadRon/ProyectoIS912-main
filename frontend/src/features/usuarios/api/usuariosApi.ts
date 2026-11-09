// frontend/src/features/usuarios/api/usuariosApi.ts
import { apiClient } from '../../../shared/api/apiClient'
import type { Usuario, CrearUsuarioDto } from '../types/usuario.types'

// 1. Endpoint GET: Obtener todos los usuarios
export const obtenerUsuariosAsync = async (): Promise<Usuario[]> => {
    const respuesta = await apiClient.get<Usuario[]>('/usuarios')

    if (!Array.isArray(respuesta.data)) {
        throw new Error('La respuesta recibida no es un arreglo JSON válido.')
    }

    return respuesta.data
}

// 2. Endpoint POST: Insertar un nuevo usuario en PostgreSQL
export const crearUsuarioAsync = async (nuevoUsuario: CrearUsuarioDto): Promise<Usuario> => {
    const respuesta = await apiClient.post<Usuario>('/usuarios', nuevoUsuario)
    return respuesta.data
}

// 3. Endpoint DELETE: Eliminar un usuario (HTTP 204, borra en cascada sus proyectos y tareas)
export const eliminarUsuarioAsync = async (id: number): Promise<void> => {
    await apiClient.delete(`/usuarios/${id}`)
}
