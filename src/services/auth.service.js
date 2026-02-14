import { http } from './http'

// Objeto con propiedades que dentro tienen funciones, son metodos.
// payload es la información que llega del usuario en el body

export const AuthService = {
    register : (payload) => http('/api/auth/register', { method: 'POST', body: payload}),
    login : (payload) => http('/api/auth/login', { method: 'POST', body: payload}),
    profile : (token) => http('/api/auth/profile', { method: 'GET', token})
}

