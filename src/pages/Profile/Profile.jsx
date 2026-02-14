import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"





export const Profile = () => {

  /* const [user, setUser] = useState(null) */
  // Sacamos user del contexto. NO hace falta
  const { user, profile } = useAuth()
  const { hasUser, setHasUser } = useState(user)
  const [error, setError] = useState(null)

  useEffect(() => {

      if(!hasUser){
        profile()
        .then(setHasUser)
        .catch(err => setError(err.message))
      }

  },[])


  return (
    <section className="card">
      <h2>PERFIL DEL USUARIO</h2>
      {error && <div className="error">{error}</div>}
      {!error && !hasUser && <p className="muted">Cargando...</p>}

      {hasUser && (
        <ul>
          {Object.entries(hasUser)
          .filter(([k]) => k !== 'password')
          .map(([k,v]) => <li key={k}><strong>{k}:</strong> {String(v)}</li>)}
        </ul>
      )}


    </section>
  )
}
