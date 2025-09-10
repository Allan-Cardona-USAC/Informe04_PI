import { useState } from 'react'
import { api } from '../lib/api'

export default function Forgot(){
  const [registro_academico, setRa] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPass, setNewPass] = useState('')
  const [msg, setMsg] = useState('')

  async function requestToken(e){
    e.preventDefault();
    const r = await api('/auth/forgot',{ method:'POST', body:{ registro_academico, email } })
    setMsg(r.message + ' (mira consola del servidor)')
  }
  async function reset(e){
    e.preventDefault();
    const r = await api('/auth/reset',{ method:'POST', body:{ token, new_password: newPass } })
    setMsg(r.message)
  }

  return (
    <div className="container">
      <h2>Restablecer contraseña</h2>
      {msg && <div>{msg}</div>}
      <form onSubmit={requestToken} className="grid" style={{marginBottom:16}}>
        <input className="input" placeholder="Registro académico" value={registro_academico} onChange={e=>setRa(e.target.value)} />
        <input className="input" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn">Solicitar token</button>
      </form>
      <form onSubmit={reset} className="grid">
        <input className="input" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
        <input className="input" placeholder="Nueva contraseña" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} />
        <button className="btn">Actualizar contraseña</button>
      </form>
    </div>
  )
}
