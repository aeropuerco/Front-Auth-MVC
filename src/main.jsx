import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider, NavLink, Outlet, redirect } from 'react-router-dom'
import { Home } from './components'
import { Login, Register, Profile } from './pages'

// No hace falta con el contexto de AuthProvider
// import {authStore } from './utils/authStore'

import { storage } from './utils/storage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// creamos el contexto


// layout general

const Layout = () => {

const { token, logout } = useAuth()


  return(
    <div>
      <nav style={{backgroundColor:'beige', padding: '20px'}}>
        <strong>API Auth Demo</strong>
        <div>
            <NavLink to='/'>Inicio | </NavLink>
            <NavLink to='/register'>Registro</NavLink>
            
            { !token ?  
            <>
                <NavLink to='/login'>Login | </NavLink> 
            </>: 
              <>
                <NavLink to='/profile'>Profile</NavLink>
                <button onClick={logout}>Logout</button>
              </>
            }
           

        </div>
      </nav>
      <main>
          <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

// Si ya no tenemos el token guardado, requerimos autenticación
// con un redirect, redirigimos al login

const requireAuth = () => {
 
  const tokenAuth = storage.get('token')
  if(!tokenAuth) throw redirect('/login')
    return null;


}


// rutas
const routes = [
  {
    path:'/',
    element: <Layout />, // componente
    children: [
      {  index:true, element: <Home /> } ,
      {  path: '/register',  element: <Register /> },
      {  path: '/login',  element: <Login /> },
      {  path: '/profile',  element: <Profile />, loader:requireAuth }   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile

    ]
  }
]

// enrutado
const router = createBrowserRouter(routes)





// Inicio del renderizado de la aplicacion. ---- AQUI USAMOS EL CONTEXTO CON LOS ESTADOS GLOBALES !!!!!
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>

  </StrictMode>,
)
