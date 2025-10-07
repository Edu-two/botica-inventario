// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.send("API de Botica funcionando correctamente");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor backend en puerto ${PORT}`));
