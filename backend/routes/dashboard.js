import { Router } from 'express'

const router = Router()

router.get('/metricas', async (req,res)=>{
  const pool = req.pool
  const today = new Date().toISOString().slice(0,10)

  const [ventasHoyRow] = await pool.query(
    "SELECT IFNULL(SUM(total),0) as total FROM ventas WHERE DATE(fecha) = ?",
    [today]
  )
  const ventasHoy = Number(ventasHoyRow[0]?.total || 0)

  const [bajo] = await pool.query("SELECT COUNT(1) as c FROM productos WHERE stock <= 10")
  const bajoStock = Number(bajo[0]?.c || 0)

  const alertas_no_leidas = 0

  const ventasUltimos7Dias = []
  for(let i=6; i>=0; i--){
    const d = new Date(Date.now() - i*86400000).toISOString().slice(0,10)
    const [r] = await pool.query("SELECT IFNULL(SUM(total),0) as total FROM ventas WHERE DATE(fecha) = ?", [d])
    ventasUltimos7Dias.push({ fecha: d, total: Number(r[0]?.total || 0) })
  }

  const [top] = await pool.query(`
    SELECT p.nombre, SUM(dv.cantidad) as unidades
    FROM detalle_venta dv
    JOIN ventas v ON v.id = dv.id_venta
    JOIN productos p ON p.id = dv.id_producto
    WHERE v.fecha >= (NOW() - INTERVAL 7 DAY)
    GROUP BY p.id, p.nombre
    ORDER BY unidades DESC
    LIMIT 10
  `)

  res.json({
    ventasHoy,
    bajoStock,
    alertas_no_leidas,
    ventasUltimos7Dias,
    topProductos: top
  })
})

export default router
