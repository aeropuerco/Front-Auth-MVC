import { useState } from "react"
import { AuthService } from "../../services/auth.service"

export const Register = () => {
    // ESTADOS DEL FORMULARIO Y ESTADOS DE CARGA Y ERROR (UI)

    const [form, setForm] = useState({nombre:'', email:'', edad:'', password:''})
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    

    // Gestión de los input del formulario

    const onChange = (e) => {
        const { name, value  } = e.target;
        setForm ((prev)=>({...prev, [name]: value}))

    }

    // Validación de los campos del formulario antes de llamar a la API

    const validate = () => {
        if(!form.nombre.trim()) return 'El nombre es obligatorio'
        if(!form.email.includes('@')) return 'Email no valido'
        if(!form.password || form.password.length < 6) return 'Contra al menos 6 digitos'
        if(!form.edad && Number.isNaN(Number(form.edad)))
        return null
    }


    // Envío del formulario - Coger los datos y llamar a la API

    const onSubmit = async (e) => {
        e.preventDefault() // evita la recarga despues del submit
        setError(null) //limpiamos mensajes de error y de ok
        setOk(null)

        const intValidate = validate()  //comprueba errores del formulario con la validacion
        if(intValidate) {setError(intValidate);return}  //si hay error lo setea, si no, no hace nada

        setLoading(true) //empieza la llamada a la API

        try {
            //cogemos el payload, lo que nos da el usuario
            const payload = {
                nombre: form.nombre.trim(),  //para que no coja espacios
                email: form.email.trim().toLowerCase(),
                password: form.password,
                ...(form.edad ? {edad: Number(form.edad)} : {} )
            }

            // llamamos a la API

            const data = await AuthService.register(payload)
            console.log('Respuesta register', data);
            setOk('Registro completado!, Ya puedes hacer login')
            
        } catch (err) {
            setError(err.message || 'Error en el registro')
        } finally {
            setLoading(false) // termina el proceso de llamada a la API
        }
    }

    // Devolver el template de la página de register

    return (
        <section className="card">
            <h2>Register</h2>

            <form onSubmit={onSubmit}>
                <input id="nombre" name="nombre" value={form.nombre} onChange={onChange} autoComplete="name" />
                <input id="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
                <input id="edad" name="edad" value={form.edad} onChange={onChange} inputMode="numeric" />
                <input id="password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" />

                {error && <div role="alert">{error}</div>}
                {ok && <div>{ok}</div>}

                <button type="button" onClick={()=>setForm({nombre:'', email:'', edad:'', password:''})}>Limpiar</button>
                <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>

            </form>
        </section>
    )
}
