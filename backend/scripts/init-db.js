import 'dotenv/config'
import { pool } from '../config/db.js'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

async function run(){
  const schema = fs.readFileSync(path.resolve('database/schema.sql'), 'utf8')
  const seed = fs.readFileSync(path.resolve('database/seed.sql'), 'utf8')

  for (const statement of schema.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean)){
    await pool.query(statement)
  }
  console.log('✅ Tablas listas')

  // Admin por defecto (admin/admin123)
  const [users] = await pool.query('SELECT COUNT(1) as c FROM usuarios')
  if(Number(users[0].c) === 0){
    const hash = bcrypt.hashSync('admin123', 10)
    await pool.query('INSERT INTO usuarios (nombre, username, email, password_hash, rol) VALUES (?,?,?,?,?)',
      ['Administrador', 'admin', 'admin@demo.com', hash, 'admin'])
    console.log('👤 Usuario admin creado (admin / admin123)')
  }

  const [pCount] = await pool.query('SELECT COUNT(1) as c FROM productos')
  if(Number(pCount[0].c) === 0){
    await pool.query(seed)
    console.log('🌱 Seed de productos/clientes insertado')
  }

  await pool.end()
  console.log('✅ DB inicializada')
}

run().catch(e=>{
  console.error('Error init DB:', e)
  process.exit(1)
})
