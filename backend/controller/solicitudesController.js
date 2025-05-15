// controllers/solicitudesController.js
const { usuarios: Usuario, administrador: Administrador } = require("../models");
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger");
const transporter = require("../config/mail");  // Importa el transportador correctamente

async function createSolicitud(req, res) {
  try {
    const { nif, id_tipo, titulo, descripcion, fechaInicio, fechaFin } = req.body;

    // Validaciones
    if (!nif || !id_tipo || !titulo || !descripcion || !fechaInicio || !fechaFin) {
      return res
        .status(400)
        .json(Respuesta.error(null, "Faltan datos obligatorios"));
    }

    // Buscar usuario y admin
    const user = await Usuario.findOne({ where: { nif } });
    if (!user) {
      return res.status(404).json(Respuesta.error(null, "Usuario no encontrado"));
    }

    const admin = await Administrador.findOne({
      where: { Idadministrador: user.id_administrador },
    });
    if (!admin) {
      return res.status(404).json(Respuesta.error(null, "Administrador no encontrado"));
    }

    // Opciones de correo
    const mailOptions = {
      from: `"MiAcciona Notificaciones" <${process.env.SMTP_USER}>`,
      to: admin.email,  // Correo del admin asignado
      replyTo: user.email,  // El email del usuario que hizo la solicitud
      subject: `Solicitud de ausencia de ${user.nombre}`,
      html: `
        <p>Hola ${admin.nombre},</p>
        <p>El usuario <strong>${user.nombre} ${user.primer_apellido}</strong> 
        (NIF: ${user.nif}) solicita ausencia:</p>
        <ul>
          <li><strong>Tipo:</strong> ${id_tipo}</li>
          <li><strong>Desde:</strong> ${fechaInicio}</li>
          <li><strong>Hasta:</strong> ${fechaFin}</li>
        </ul>
        <p>Motivo: ${descripcion}</p>
      `,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    logMensaje(`Correo de prueba enviado; preview: ${previewUrl}`, "info");

    return res
      .status(200)
      .json(
        Respuesta.exito(
          { previewUrl },
          "Solicitud (de prueba) enviada correctamente"
        )
      );
  } catch (err) {
    logMensaje("Error en createSolicitud: " + err.stack, "error");
    return res
      .status(500)
      .json(Respuesta.error(null, "Error interno del servidor"));
  }
}

module.exports = { createSolicitud };
