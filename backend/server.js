const express = require('express');
const app = express();

const User = require('./database');

const cors = require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.post('/login', (req, res) => {
  let data = req.body;
  let user = User.find({username: data.username, password: data.password}, {username: 1, _id: 0}).select('username').exec();
  user.then(result => {
    if (result.length === 1) {
      res.status(200).send(result[0]);
    } else {
      res.status(400).send({
        message: 'Invalid username or password'
      });
    }
  });
});

app.post('/api/msg/encrypt', (req, res) => {
  let msg = req.body;
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(msg.message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  res.send({iv: iv.toString('hex'), message: encrypted.toString('hex')});
});

app.post('/api/msg/decrypt', (req, res) => {
  let msg = req.body;
  let iv = Buffer.from(msg.iv, 'hex');
  let encryptedText = Buffer.from(msg.message, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  res.send({message: decrypted.toString()});
});

// Start server
app.listen(5000);