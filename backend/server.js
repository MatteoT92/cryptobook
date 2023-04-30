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

// Bcrypt Library
const bcrypt = require('bcrypt');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.post('/login', (req, res) => {
  let data = req.body;
  let passwordEncrypted = User.find({username: data.username}, {password: 1, _id: 0}).select('password').exec();
  passwordEncrypted.then(result => {
    if (bcrypt.compareSync(data.password, result[0].password)) {
      let user = User.find({username: data.username, password: result[0].password}, {username: 1, _id: 0}).select('username').exec();
      user.then(result => {
        if (result.length === 1) {
          res.status(200).send(result[0]);
        } else {
          res.status(400).send({message: 'Invalid username or password'});
        }
      });
    } else {
      res.status(400).send({status: 400});
    }
  });
});

app.post('/sign', (req, res) => {
  let data = req.body;
  let email = User.find({email: data.email}, {email: 1, _id: 0}).select('email').exec();
  email.then(result => {
    if (result.length === 0) {
      let user = new User({username: data.username, password: bcrypt.hashSync(data.password, 10), email: data.email});
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
  let messages = User.find({username: data.user}, {messages: 1, _id: 0}).select('messages').exec();
  messages.then(result => {
    let messagesFiltered = result[0].messages.filter(msg => msg.receiver === data.friend);
    res.send({messages: messagesFiltered});
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
  if (decryptedText.length > 0) {
    res.send({message: decryptedText});
  } else {
    res.send({message: msg.message});
  }
});

app.post('/api/msg/send', (req, res) => {
  let msg = req.body;
  let msgSended = User.updateOne({username: msg.sender}, {$push: {messages: msg}});
  msgSended.then(result => {
    res.send({status: 200});
  })
});

app.get('/api/friends', (req, res) => {
  let data = req.query;
  let friends = User.find({username: data.user}, {friends: 1, _id: 0}).select('friends').exec();
  friends.then(result => {
    res.send(result[0]);
  })
});

app.post('/api/settings/password', (req, res) => {
  let data = req.body;
  let passwordEncrypted = User.find({username: data.username}, {password: 1, _id: 0}).select('password').exec();
  passwordEncrypted.then(result => {
    if (bcrypt.compareSync(data.oldPassword, result[0].password)) {
      let user = User.find({username: data.username, password: result[0].password}, {username: 1, _id: 0}).select('username').exec();
      user.then(result => {
        if (result.length === 1) {
          let newPassword = User.updateOne({username: data.username}, {password: bcrypt.hashSync(data.newPassword, 10)});
          newPassword.then(result => {
            res.status(200).send({status: 200});
          });
        } else {
          res.status(400).send({status: 400});
        }
      });
    } else {
      res.status(400).send({status: 400});
    }
  });
});

app.post('/api/settings/unsubscribe', (req, res) => {
  let data = req.body;
  let user = User.findOneAndDelete({username: data.username});
  user.then(result => {
    res.status(200).send({status: 200});
  });
});

// Start server
app.listen(5000);