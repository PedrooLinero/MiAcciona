const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga variables de entorno

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: 'TLSv1',
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error en la conexión SMTP:', error);
  } else {
    console.log('SMTP listo para enviar correos');
  }
});