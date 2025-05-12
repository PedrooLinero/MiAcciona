// index.js (o app.js)
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const tipoAusenciaRoutes = require("./routes/tipoAusenciaRoutes");

// Config
const config = require("./config/config");

const app = express();

// Orígenes permitidos (tu frontend)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081";

// Middlewares
app.use(express.json());
app.use(cookieParser()); // para parsear la cookie HTTP-Only
app.use(
  cors({
    origin: FRONTEND_URL, // no '*'
    credentials: true, // Access-Control-Allow-Credentials: true
  })
);

// Rutas de la API Rest
app.use("/api", usuarioRoutes);
app.use("/api/tipoAusencia", tipoAusenciaRoutes);

// (Opcional) servir estáticos
// app.use(express.static(path.join(__dirname, "public")));

// Inicio del servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${config.port}`);
  });
}

module.exports = app;
