import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function CreatePost(){
  const [tipo, setTipo] = useState('CURSO')
  const [cursos, setCursos] = useState([])
  const [curso_id, setCurso] = useState('')
  const [instructor_id, setInstructor] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [instructores] = useState([{id:1,nombre:'Ing. Ana Gomez'},{id:2,nombre:'MSc. Luis Perez'},{id:3,nombre:'Aux. Carlos Lopez'}])

  useEffect(()=>{ api('/courses').then(setCursos) },[])

  async function onSubmit(e){
    e.preventDefault()
    await api('/posts',{ method:'POST', auth:true, body:{ tipo, curso_id: tipo==='CURSO'? Number(curso_id) || null : null, instructor_id: tipo==='CATEDRATICO'? Number(instructor_id) || null : null, mensaje } })
    setMensaje('')
    alert('Publicación creada')
  }

  return (
    <div className="container">
      <h2>Crear Publicación</h2>
      <form onSubmit={onSubmit} className="grid">
        <select className="select" value={tipo} onChange={e=>setTipo(e.target.value)}>
          <option value="CURSO">Curso</option>
          <option value="CATEDRATICO">Catedrático</option>
        </select>
        {tipo==='CURSO' ? (
          <select className="select" value={curso_id} onChange={e=>setCurso(e.target.value)}>
            <option value="">Seleccione curso</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
          </select>
        ) : (
          <select className="select" value={instructor_id} onChange={e=>setInstructor(e.target.value)}>
            <option value="">Seleccione catedrático</option>
            {instructores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        )}
        <textarea className="textarea" rows="5" placeholder="Mensaje de la publicación" value={mensaje} onChange={e=>setMensaje(e.target.value)} />
        <button className="btn">Publicar</button>
      </form>
    </div>
  )
}
