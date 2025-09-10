import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register(){
  const [form, setForm] = useState({registro_academico:'',nombres:'',apellidos:'',email:'',password:''})
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    try{
      await api('/auth/register',{ method:'POST', body:form })
      nav('/login')
    }catch(e){ setErr(e.message) }
  }

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      {err && <div style={{color:'salmon'}}>{err}</div>}
      <form onSubmit={onSubmit} className="grid">
        <input className="input" placeholder="Registro académico" value={form.registro_academico} onChange={e=>setForm({...form, registro_academico:e.target.value})}/>
        <input className="input" placeholder="Nombres" value={form.nombres} onChange={e=>setForm({...form, nombres:e.target.value})}/>
        <input className="input" placeholder="Apellidos" value={form.apellidos} onChange={e=>setForm({...form, apellidos:e.target.value})}/>
        <input className="input" placeholder="Correo" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="input" placeholder="Contraseña" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button className="btn">Registrarme</button>
      </form>
    </div>
  )
}
