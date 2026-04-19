const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};

// --- Email templates ---

const orderConfirmationEmail = (userName, serviceName, orderId) => ({
  subject: 'Confirmation de votre commande — WebForge',
  html: `
    <h2>Bonjour ${userName},</h2>
    <p>Votre commande <strong>#${orderId}</strong> pour le service <strong>${serviceName}</strong> a bien été reçue.</p>
    <p>Nous reviendrons vers vous très prochainement.</p>
    <br><p>L'équipe WebForge</p>
  `,
});

const statusUpdateEmail = (userName, serviceName, orderId, status) => ({
  subject: `Statut de votre commande mis à jour — WebForge`,
  html: `
    <h2>Bonjour ${userName},</h2>
    <p>Le statut de votre commande <strong>#${orderId}</strong> (${serviceName}) a été mis à jour :</p>
    <p><strong>Nouveau statut : ${status}</strong></p>
    <br><p>L'équipe WebForge</p>
  `,
});

module.exports = { sendMail, orderConfirmationEmail, statusUpdateEmail };
