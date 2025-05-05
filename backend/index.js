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

// Configuración de orígenes permitidos
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://10.140.15.36:8081",
  "http://localhost:8081",
  "http://localhost:19006", // Para Expo
  "exp://192.168.1.X:19000" // Reemplaza con tu IP para Expo Go
];

// Configuración CORS dinámica
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como apps móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin) || 
        origin.includes("//localhost:") || 
        origin.startsWith("exp://")) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["set-cookie"]
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Manejo de preflight requests
app.options("*", cors(corsOptions));

// Rutas de la API Rest
app.use("/api", usuarioRoutes);
app.use("/api/tipoAusencia", tipoAusenciaRoutes);

// Middleware para manejar errores CORS
app.use((err, req, res, next) => {
  if (err.message === "Origen no permitido por CORS") {
    return res.status(403).json({ 
      error: "Acceso denegado por política CORS" 
    });
  }
  next(err);
});

// Inicio del servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`
      Servidor escuchando en el puerto ${config.port}
      Entorno: ${process.env.NODE_ENV || "development"}
      Orígenes permitidos: ${ALLOWED_ORIGINS.join(", ")}
    `);
  });
}

module.exports = app;