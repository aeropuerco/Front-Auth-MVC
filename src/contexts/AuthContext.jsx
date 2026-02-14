import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'
import { AuthService } from '../services/auth.service'

// crear el contexto

const AuthContext = createContext(null)

// crear la función que va a proveer ese contexto

export const AuthProvider = ({ children }) => {

    // Coge token y user del localStorage
    const [token, setToken] = useState( () => storage.get('token'))
    const [user, setUser]   = useState( () => storage.get('user'))

    // si token o user cambian, se guardan en el localStorage
    useEffect( () => {
        storage.set('token', token)
    }, [token])
        // Si el [token] cambia, ejecuta el set

    useEffect( () => {
        storage.set('user', user)
    }, [user])


    // función de LOGIN

    const login = useCallback( async (email, password) => {
            const data = await AuthService.login({ email, password })
            const tokenLogin = data.token ?? data?.data?.token;  //el primer data es el de la variable creada. El segundo es el que llega.
            const userLogin = data.user ?? data?.data?.user ?? data?.data;
            
            if(!tokenLogin) throw new Error("El servidor de backend no ha devuelto el login")
            
            setToken(tokenLogin)
            setUser(userLogin ?? null)

            return { token: tokenLogin, user: userLogin}
    }, [])

    // funcion logout

    const logout = useCallback( () => {
        setToken(null)
        setUser(null)
        storage.remove('token')
        storage.remove('user')

    }, [])

    // funcion de llamar al profile

    const profile = useCallback(async () => {
        if(!token) return null
        const profile = await AuthService.profile(token)
        setUser(profile)
        return profile
    }, [token])
    
    return (
        // * Todo lo que se meta aqui podrá usar token, user, etc.
        <AuthContext.Provider value={{ token, user, login, logout, profile }}>
            { children } 
        </AuthContext.Provider>
    )
}

// función para usar el contexto

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext)
    return ctx
}