import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Home(){
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ tipo:'', curso:'', instructor:'', cursoNombre:'', instructorNombre:'' });

  async function load(){
    const q = new URLSearchParams(Object.entries(filters).filter(([,v])=>v));
    const data = await api('/posts' + (q.toString()?`?${q.toString()}`:''));
    setItems(data);
  }
  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h2 style={{display:'flex', alignItems:'center', gap:12}}>Publicaciones <span className="badge">{items.length}</span></h2>

      <div className="card" style={{marginBottom:16}}>
        <div className="grid grid-5">
          <select className="select" value={filters.tipo} onChange={e=>setFilters({...filters, tipo:e.target.value})}>
            <option value="">Tipo</option>
            <option value="CURSO">Curso</option>
            <option value="CATEDRATICO">Catedrático</option>
          </select>
          <input className="input" placeholder="Código curso (SIS201)" value={filters.curso} onChange={e=>setFilters({...filters, curso:e.target.value})}/>
          <input className="input" placeholder="Nombre curso" value={filters.cursoNombre} onChange={e=>setFilters({...filters, cursoNombre:e.target.value})}/>
          <input className="input" placeholder="Nombre catedrático" value={filters.instructorNombre} onChange={e=>setFilters({...filters, instructorNombre:e.target.value})}/>
          <button className="btn" onClick={load}>Aplicar filtros</button>
        </div>
      </div>

      <ul style={{listStyle:'none', padding:0, display:'grid', gap:12}}>
        {items.map(p => (
          <li className="card post" key={p.id}>
            <div className="post-meta">{new Date(p.created_at).toLocaleString()}</div>
            <div className="post-title">
              {p.tipo === 'CURSO' ? (p.curso_codigo + ' · ' + (p.curso_nombre||'')) : (p.instructor_nombre||'')}
            </div>
            <p style={{marginTop:6}}>{p.mensaje}</p>
            <div className="post-meta">Por: {p.nombres} {p.apellidos} ({p.registro_academico})</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
