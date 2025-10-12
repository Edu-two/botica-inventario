import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/', requireAuth, async (req,res)=>{
  const { id_cliente, items } = req.body || {}
  if(!Array.isArray(items) || items.length===0){
    return res.status(400).json({ message:'Items es requerido' })
  }
  const conn = await req.pool.getConnection()
  try{
    await conn.beginTransaction()

    let total = 0
    for(const it of items){
      const [rows] = await conn.query('SELECT id, nombre, precio, stock FROM productos WHERE id=? FOR UPDATE', [it.id_producto])
      const p = rows[0]
      if(!p) throw new Error(`Producto ${it.id_producto} no existe`)
      if(p.stock < it.cantidad) throw new Error(`Stock insuficiente para ${p.nombre}`)
      total += (it.precio_unitario ?? p.precio) * it.cantidad
    }

    const now = new Date()
    const [insV] = await conn.query('INSERT INTO ventas (fecha, total, id_usuario, id_cliente) VALUES (?,?,?,?)',
      [now, total, req.user?.id || 1, id_cliente || null])
    const id_venta = insV.insertId

    for(const it of items){
      const [rows] = await conn.query('SELECT precio FROM productos WHERE id=?', [it.id_producto])
      const precioBase = rows[0]?.precio ?? 0
      const precio = it.precio_unitario ?? precioBase
      await conn.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?,?,?,?)',
        [id_venta, it.id_producto, it.cantidad, precio]
      )
      await conn.query('UPDATE productos SET stock = stock - ? WHERE id=?', [it.cantidad, it.id_producto])
    }

    await conn.commit()
    res.status(201).json({ id: id_venta, total })
  }catch(e){
    await conn.rollback()
    res.status(400).json({ message: e.message || 'Error en la venta' })
  }finally{
    conn.release()
  }
})

export default router
