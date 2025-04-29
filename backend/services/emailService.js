const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendResultEmail(to, resultData) {
  const mailOptions = {
    from: `"Kiara Circles" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Kiara Wheel Results',
    html: `
      <h1>Congratulations!</h1>
      <p>Your Kiara Wheel is ready! 🎯</p>
      <p><strong>Activities and Outcomes:</strong></p>
      <ul>
        ${resultData.activities.map(a => `<li><b>${a.name}</b> - ${a.outcomeCategory} - ${a.outcomeSubCategory}</li>`).join('')}
      </ul>
      <p>Ready to take action based on your unique talents!</p>
      <br>
      <p>💌 Powered by Kiara Circles</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendResultEmail;
