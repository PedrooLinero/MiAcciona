require('dotenv').config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const tipoAusenciaRoutes = require("./routes/tipoAusenciaRoutes");
const administradorRoutes = require("./routes/administradorRoutes"); // Añadido
const solicitudesRoutes = require('./routes/solicitudesRoutes');


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

// En tu archivo principal (app.js o server.js)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Responde con "No Content"
});

// Ruta específica para obtener ausencias por NIF
app.get('/api/usuarios/:nif/ausencias', (req, res) => {
  const tipoAusenciaController = require('./controller/tipoAusenciaController');
  tipoAusenciaController.getDiasPorTipo(req, res);
});

// Rutas de la API Rest
app.use("/api", usuarioRoutes);
app.use("/api/tipoAusencia", tipoAusenciaRoutes);
app.use("/api", administradorRoutes); // Añadido
app.use('/api/solicitudes', solicitudesRoutes);


// (Opcional) servir estáticos
// app.use(express.static(path.join(__dirname, "public")));

// Inicio del servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${config.port}`);
  });
}

module.exports = app;