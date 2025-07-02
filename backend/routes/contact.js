const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    await newContact.save();


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message: ${subject || 'No Subject'}`,
      html: `
        <p>You have a new message from your website contact form:</p>
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject || 'N/A'}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
        <p><em>This message was sent from your website's contact form.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error handling contact form submission:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
