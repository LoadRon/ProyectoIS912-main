// src/App.tsx
import { useState } from 'react'
import { AppLayout, type Vista } from './layouts/AppLayout'
import { UsuariosView } from './features/usuarios/components/UsuariosView'
import { ProyectosView } from './features/proyectos/components/ProyectosView'
import { TareasView } from './features/tareas/components/TareasView'

function App() {
  // Vista activa del menú (cada vista vuelve a consultar al servidor al montarse)
  const [vista, setVista] = useState<Vista>('usuarios')

  return (
    <AppLayout vistaActiva={vista} onCambiarVista={setVista}>
      {vista === 'usuarios' && <UsuariosView />}
      {vista === 'proyectos' && <ProyectosView />}
      {vista === 'tareas' && <TareasView />}
    </AppLayout>
  )
}

export default App
