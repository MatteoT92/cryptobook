// Create server
const express = require('express');
const app = express();

// Database MongoDB
const User = require('./database');

// Setting CORS policy
const cors = require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

// Crypto Library
const {AES, enc} = require('crypto-js');

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

app.post('/sign', (req, res) => {
  let data = req.body;
  let email = User.find({email: data.email}, {email: 1, _id: 0}).select('email').exec();
  email.then(result => {
    if (result.length === 0) {
      let user = new User({username: data.username, password: data.password, email: data.email});
      user.save().then(result => {
        res.status(200).send({status: 200});
      }).catch(err => {
        res.status(400).send({status: 400});
      });
    } else {
      res.status(400).send({status: 400});
    }
  })
});

app.get('/api/messages', (req, res) => {
  let data = req.query;
  let messages = User.find({username: data.username}, {messages: 1, _id: 0}).select('messages').exec();
  messages.then(result => {
    res.send(result[0]);
  })
});

app.post('/api/msg/encrypt', (req, res) => {
  let msg = req.body;
  let cipherText = AES.encrypt(msg.message, msg.key).toString();
  res.send({message: cipherText});
});

app.post('/api/msg/decrypt', (req, res) => {
  let msg = req.body;
  let decryptedText = AES.decrypt(msg.message, msg.key).toString(enc.Utf8);
  res.send({message: decryptedText});
});

app.post('/api/msg/send', (req, res) => {
  let msg = req.body;
  let msgSended = User.updateOne({username: msg.sender}, {$push: {messages: msg}});
  msgSended.then(result => {
    res.send({status: 200});
  })
});

// Start server
app.listen(5000);