const nodemailer = require('nodemailer');

// Configuración de transportador para Gmail usando OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.SMTP_USER,  // Tu correo de Gmail
    clientId: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    refreshToken: process.env.OAUTH2_REFRESH_TOKEN,  // Token de refresco OAuth2
    accessToken: process.env.OAUTH2_ACCESS_TOKEN,  // Token de acceso OAuth2
  },
});

module.exports = transporter;
