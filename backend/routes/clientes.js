import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/', async (req,res)=>{
  const { query } = req.query
  let sql = 'SELECT * FROM clientes'
  let params = []
  if(query){
    const q = `%${String(query).toLowerCase()}%`
    sql += ' WHERE LOWER(nombre) LIKE ? OR LOWER(documento) LIKE ?'
    params = [q, q]
  }
  sql += ' ORDER BY id DESC'
  const [rows] = await req.pool.query(sql, params)
  res.json(rows)
})

router.post('/', requireAuth, async (req,res)=>{
  const { nombre, documento, telefono, email } = req.body || {}
  if(!nombre || !documento) return res.status(400).json({ message:'Nombre y documento son obligatorios' })
  const [exist] = await req.pool.query('SELECT id FROM clientes WHERE documento=?', [documento])
  if(exist.length) return res.status(409).json({ message:'El documento ya existe' })
  const [ins] = await req.pool.query('INSERT INTO clientes (nombre, documento, telefono, email) VALUES (?,?,?,?)', [nombre, documento, telefono||'', email||''])
  const [rows] = await req.pool.query('SELECT * FROM clientes WHERE id=?', [ins.insertId])
  res.status(201).json(rows[0])
})

router.put('/:id', requireAuth, async (req,res)=>{
  const id = Number(req.params.id)
  const [rows] = await req.pool.query('SELECT * FROM clientes WHERE id=?', [id])
  const exists = rows[0]
  if(!exists) return res.status(404).json({ message:'Cliente no encontrado' })
  const { nombre, documento, telefono, email, puntos_fidelidad } = req.body || {}
  const upd = {
    nombre: nombre ?? exists.nombre,
    documento: documento ?? exists.documento,
    telefono: telefono ?? exists.telefono,
    email: email ?? exists.email,
    puntos_fidelidad: puntos_fidelidad ?? exists.puntos_fidelidad
  }
  await req.pool.query('UPDATE clientes SET nombre=?, documento=?, telefono=?, email=?, puntos_fidelidad=? WHERE id=?',
    [upd.nombre, upd.documento, upd.telefono, upd.email, upd.puntos_fidelidad, id])
  const [finalRow] = await req.pool.query('SELECT * FROM clientes WHERE id=?', [id])
  res.json(finalRow[0])
})

export default router
