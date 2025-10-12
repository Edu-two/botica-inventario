import { useEffect, useMemo, useState } from 'react'
import api from '@/services/api.js'

export default function Sales(){
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([]) // {id, nombre, precio, qty}
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    (async()=>{
      const p = await api.get('/productos')
      setProducts(Array.isArray(p.data?.items) ? p.data.items : (Array.isArray(p.data) ? p.data : []))
      const c = await api.get('/clientes')
      setClients(Array.isArray(c.data?.items) ? c.data.items : (Array.isArray(c.data) ? c.data : []))
    })()
  }, [])

  const filtered = useMemo(()=>{
    const s = query.toLowerCase()
    return products.filter(x => (x.nombre||'').toLowerCase().includes(s))
  }, [products, query])

  function addToCart(p){
    setCart((prev)=>{
      const i = prev.findIndex(x=>x.id===p.id)
      if(i>=0){
        const cp = [...prev]
        cp[i] = { ...cp[i], qty: Math.min((cp[i].qty||1)+1, p.stock || 9999) }
        return cp
      }
      return [...prev, { id:p.id, nombre:p.nombre, precio:Number(p.precio||0), qty:1, max:p.stock||0 }]
    })
  }
  function updateQty(id, qty){
    setCart(prev=> prev.map(x=> x.id===id ? {...x, qty: Math.max(1, Number(qty)||1)} : x ))
  }
  function removeItem(id){ setCart(prev=> prev.filter(x=> x.id!==id)) }
  const total = cart.reduce((s,x)=> s + x.precio * x.qty, 0)

  async function saveSale(){
    if(!cart.length){ alert('Agrega productos al carrito'); return }
    setSaving(true)
    try{
      const payload = {
        id_cliente: clientId || null,
        items: cart.map(x => ({ id_producto: x.id, cantidad: x.qty, precio_unitario: x.precio }))
      }
      await api.post('/ventas', payload)
      alert('Venta registrada ✅')
      setCart([])
    }catch(err){
      alert('Error: '+(err?.response?.data?.message || err.message))
    }finally{
      setSaving(false)
    }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="grid cols-2">
        <div className="card">
          <h3 style={{marginTop:0}}>Buscar productos</h3>
          <input placeholder="Buscar por nombre…" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <div style={{marginTop:12, maxHeight:280, overflow:'auto'}}>
            <table className="table">
              <thead>
                <tr><th>Producto</th><th>Precio</th><th>Stock</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>S/. {Number(p.precio||0).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td><button onClick={()=>addToCart(p)}>Agregar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>Carrito</h3>
          {cart.length === 0 ? <div>No hay productos</div> : (
            <table className="table">
              <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th><th></th></tr></thead>
              <tbody>
                {cart.map(item=>(
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>
                      <input type="number" min="1" value={item.qty}
                        onChange={(e)=>updateQty(item.id, e.target.value)} style={{width:80}} />
                    </td>
                    <td>S/. {item.precio.toFixed(2)}</td>
                    <td>S/. {(item.precio*item.qty).toFixed(2)}</td>
                    <td><button onClick={()=>removeItem(item.id)} style={{background:'#2a0f15'}}>Quitar</button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td colSpan="3" style={{textAlign:'right'}}><strong>Total</strong></td><td colSpan="2"><strong>S/. {total.toFixed(2)}</strong></td></tr>
              </tfoot>
            </table>
          )}

          <div className="grid cols-2" style={{marginTop:12, alignItems:'end'}}>
            <div>
              <label>Cliente</label>
              <select value={clientId} onChange={(e)=>setClientId(e.target.value)}>
                <option value="">Sin cliente</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div style={{textAlign:'right'}}>
              <button className="primary" onClick={saveSale} disabled={saving || cart.length===0}>
                {saving ? 'Guardando…' : 'Registrar venta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
