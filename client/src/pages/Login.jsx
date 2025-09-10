import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    try{
      const { token } = await api('/auth/login',{ method:'POST', body:{ email, password } })
      localStorage.setItem('token', token)
      nav('/')
    }catch(e){ setErr(e.message) }
  }

  return (
    <div className="container">
      <h2>Inicio de Sesión</h2>
      {err && <div style={{color:'salmon'}}>{err}</div>}
      <form onSubmit={onSubmit} className="grid">
        <input className="input" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Ingresar</button>
      </form>
      <div style={{marginTop:8}}> 
        <Link to="/register">Registrarse</Link>
      </div>
    </div>
  )
}
