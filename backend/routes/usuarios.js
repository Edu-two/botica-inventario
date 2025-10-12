import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const ALLOWED_ROLES = ['admin','empleado']

const router = Router()

// Listar usuarios (admin)
router.get('/', requireAuth, requireRole('admin'), async (req,res)=>{
  const [rows] = await req.pool.query('SELECT id, nombre, username, email, rol FROM usuarios ORDER BY id DESC')
  res.json(rows)
})

// Crear usuario (admin) con rol seleccionado
router.post('/', requireAuth, requireRole('admin'), async (req,res)=>{
  const { nombre, username, email, password, rol } = req.body || {}
  if(!nombre || !username || !email || !password){
    return res.status(400).json({ message:'nombre, username, email y password son obligatorios' })
  }
  const role = (rol || 'empleado').toLowerCase()
  if(!ALLOWED_ROLES.includes(role)) return res.status(400).json({ message:'Rol inválido (usa admin o empleado)' })
  const [existsU] = await req.pool.query('SELECT id FROM usuarios WHERE username=? OR email=?', [username, email])
  if(existsU.length) return res.status(409).json({ message:'username o email ya existen' })
  const hash = bcrypt.hashSync(password, 10)
  await req.pool.query('INSERT INTO usuarios (nombre, username, email, password_hash, rol) VALUES (?,?,?,?,?)',
    [nombre, username, email, hash, role])
  res.status(201).json({ ok:true })
})

// Actualizar rol (admin)
router.put('/:id/rol', requireAuth, requireRole('admin'), async (req,res)=>{
  const id = Number(req.params.id)
  const { rol } = req.body || {}
  const role = (rol || '').toLowerCase()
  if(!ALLOWED_ROLES.includes(role)) return res.status(400).json({ message:'Rol inválido (usa admin o empleado)' })
  const [rows] = await req.pool.query('SELECT id FROM usuarios WHERE id=?', [id])
  if(!rows.length) return res.status(404).json({ message:'Usuario no encontrado' })
  await req.pool.query('UPDATE usuarios SET rol=? WHERE id=?', [role, id])
  res.json({ ok:true })
})

export default router
