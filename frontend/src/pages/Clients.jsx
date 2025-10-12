import { useEffect, useMemo, useState } from 'react'
import api from '@/services/api.js'

export default function Clients(){
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ id:null, nombre:'', documento:'', telefono:'', email:'' })

  async function fetchList(){
    setLoading(true)
    try{
      const { data } = await api.get('/clientes', { params: { query: q || undefined } })
      // backend options: either {items:[]} or []
      setList(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []))
    }catch(err){
      setError(err?.response?.data?.message || err.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchList() }, [])

  const filtered = useMemo(()=>{
    const s = (q||'').toLowerCase()
    return list.filter(c => (c.nombre||'').toLowerCase().includes(s) || (c.documento||'').toLowerCase().includes(s))
  }, [list, q])

  function startCreate(){
    setForm({ id:null, nombre:'', documento:'', telefono:'', email:'' })
  }
  function startEdit(c){
    setForm({ id:c.id, nombre:c.nombre||'', documento:c.documento||c.dni||'', telefono:c.telefono||'', email:c.email||'' })
  }

  async function save(e){
    e.preventDefault()
    const payload = { nombre: form.nombre, documento: form.documento, telefono: form.telefono, email: form.email }
    try{
      if(form.id){
        await api.put(`/clientes/${form.id}`, { puntos_fidelidad: 0, ...payload })
      }else{
        await api.post(`/clientes`, payload)
      }
      await fetchList()
      startCreate()
      alert('Guardado ✅')
    }catch(err){
      alert('Error: '+(err?.response?.data?.message || err.message))
    }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div className="searchbar">
          <input placeholder="Buscar cliente por nombre o documento…" value={q} onChange={(e)=>setQ(e.target.value)}/>
          <button className="ghost" onClick={fetchList}>Actualizar</button>
          <div style={{marginLeft:'auto'}}>
            <button className="primary" onClick={startCreate}>+ Nuevo cliente</button>
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3 style={{marginTop:0}}>Clientes</h3>
          {loading ? 'Cargando…' : error ? ('Error: '+error) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Nombre</th><th>Documento</th><th>Teléfono</th><th>Email</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c=>(
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.documento || c.dni}</td>
                    <td>{c.telefono || '-'}</td>
                    <td>{c.email || '-'}</td>
                    <td className="actions">
                      <button onClick={()=>startEdit(c)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>{form.id ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          <form className="grid" style={{gap:12}} onSubmit={save}>
            <input required placeholder="Nombre completo" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />
            <div className="grid cols-2">
              <input required placeholder="Documento (DNI/RUC)" value={form.documento} onChange={e=>setForm({...form, documento:e.target.value})} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})} />
            </div>
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <div className="actions">
              <button className="primary" type="submit">Guardar</button>
              <button type="button" className="ghost" onClick={startCreate}>Limpiar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
