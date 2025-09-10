import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function Profile(){
  const { registro } = useParams()
  const [me, setMe] = useState(null)
  const [approved, setApproved] = useState({ items:[], total_creditos:0 })
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')

  const isMe = registro === 'me'

  useEffect(()=>{
    if (isMe) api('/users/me', {auth:true}).then(setMe)
    else api('/users/profile/'+registro).then(setMe)
  },[registro])

  useEffect(()=>{ api('/courses').then(setCourses) },[])

  useEffect(()=>{
    const r = isMe && me?.registro_academico ? me.registro_academico : registro
    if (r) api('/users/approved?registro='+r).then(setApproved).catch(()=>setApproved({items:[], total_creditos:0}))
  },[me, registro, isMe])

  async function addCourse(){
    await api('/users/approved', { method:'POST', auth:true, body:{ course_id: Number(courseId) } })
    setCourseId('')
    const r = isMe && me?.registro_academico ? me.registro_academico : registro
    api('/users/approved?registro='+r).then(setApproved)
  }

  if (!me) return <div className="container">Cargando...</div>
  return (
    <div className="container">
      <h2>Perfil de {me.nombres} {me.apellidos}</h2>
      <div>Registro: {me.registro_academico}</div>
      <div>Correo: {me.email}</div>

      <h3 style={{marginTop:24}}>Cursos Aprobados</h3>
      <div>Total de créditos (estimados): {approved.total_creditos}</div>
      <ul style={{marginTop:8, paddingLeft:18}}>
        {approved.items.map(it => <li key={it.id}>{it.codigo} - {it.nombre}</li>)}
      </ul>

      {isMe && (
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <select className="select" value={courseId} onChange={e=>setCourseId(e.target.value)}>
            <option value="">Agregar curso aprobado</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
          </select>
          <button className="btn" onClick={addCourse}>Agregar</button>
        </div>
      )}
    </div>
  )
}
