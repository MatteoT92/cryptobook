// Create server
const express = require("express");
const app = express();

// Database MongoDB
const { User, Message, Chat } = require("./database");

// Setting CORS policy
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// Crypto Library
const { AES, enc } = require("crypto-js");

// Bcrypt Library
const bcrypt = require("bcrypt");

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.post("/login", (req, res) => {
  let data = req.body;
  let passwordEncrypted = User.find(
    { username: data.username },
    { password: 1, _id: 0 }
  )
    .select("password")
    .exec();
  passwordEncrypted.then((result) => {
    if (bcrypt.compareSync(data.password, result[0].password)) {
      let user = User.find(
        { username: data.username, password: result[0].password },
        { username: 1, _id: 0 }
      )
        .select("username")
        .exec();
      user.then((result) => {
        if (result.length === 1) {
          res.status(200).send(result[0]);
        } else {
          res.status(400).send({ message: "Invalid username or password" });
        }
      });
    } else {
      res.status(400).send({ status: 400 });
    }
  });
});

app.post("/sign", (req, res) => {
  let data = req.body;
  let email = User.find({ email: data.email }, { email: 1, _id: 0 })
    .select("email")
    .exec();
  email.then((result) => {
    if (result.length === 0) {
      let type = data.photo.split("/")[1].split(";")[0];
      let image = Buffer.from(data.photo.split(",")[1], "base64");
      let user = new User({
        username: data.username,
        password: bcrypt.hashSync(data.password, 10),
        email: data.email,
        photo: image,
        typePhoto: type,
      });
      user
        .save()
        .then((result) => {
          res.status(200).send({ status: 200 });
        })
        .catch((err) => {
          res.status(400).send({ status: 400 });
        });
    } else {
      res.status(400).send({ status: 400 });
    }
  });
});

app.get("/api/photo", (req, res) => {
  let data = req.query;
  User.findOne({ username: data.username }, { photo: 1, typePhoto: 1, _id: 0 })
    .then((user) => {
      if (!user) {
        return res.status(404).send("Utente non trovato");
      }
      const imageBinData = user.photo;
      const imageBase64 = imageBinData.toString("base64");
      res.send({ photo: imageBase64, typePhoto: user.typePhoto });
    })
    .catch((err) => {
      res.status(500).send("Errore del server");
    });
});

app.get("/api/messages", (req, res) => {
  let data = req.query;
  let users = User.find(
    { username: { $in: [data.user, data.friend] } },
    { _id: 1 }
  )
    .select("_id")
    .exec();
  users.then((result) => {
    const user1 = result[0]._id;
    const user2 = result[1]._id;
    const messages = Chat.findOne({
      $and: [{ members: user1 }, { members: user2 }],
    })
      .populate("messages.sender", "username")
      .populate("messages.receiver", "username")
      .exec();
    messages.then((result) => {
      res.send(result);
    });
  });
});

app.post("/api/msg/encrypt", (req, res) => {
  let msg = req.body;
  let cipherText = AES.encrypt(msg.message, msg.key).toString();
  res.send({ message: cipherText });
});

app.post("/api/msg/decrypt", (req, res) => {
  let msg = req.body;
  let decryptedText = AES.decrypt(msg.message, msg.key).toString(enc.Utf8);
  if (decryptedText.length > 0) {
    res.send({ message: decryptedText });
  } else {
    res.send({ message: msg.message });
  }
});

app.post("/api/msg/send", async (req, res) => {
  let msg = req.body;
  try {
    let users = await User.find(
      { username: { $in: [msg.sender, msg.receiver] } },
      { _id: 1 }
    )
      .select("_id")
      .exec();
    const user1 = users[0]._id;
    const user2 = users[1]._id;
    let chat = await Chat.findOne({
      $and: [{ members: user1 }, { members: user2 }],
    }).exec();
    if (!chat) {
      chat = new Chat({ members: [user1, user2] });
      await chat.save();
    }
    const message = new Message({
      sender: user1,
      receiver: user2,
      message: msg.message,
    });
    chat.messages.push(message);
    await chat.save();
    res.send({ status: 200 });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/api/friends", (req, res) => {
  let data = req.query;
  let friends = User.find({ username: data.user }, { friends: 1, _id: 0 })
    .select("friends")
    .exec();
  friends.then((result) => {
    res.send(result[0]);
  });
});

app.post("/api/settings/password", (req, res) => {
  let data = req.body;
  let passwordEncrypted = User.find(
    { username: data.username },
    { password: 1, _id: 0 }
  )
    .select("password")
    .exec();
  passwordEncrypted.then((result) => {
    if (bcrypt.compareSync(data.oldPassword, result[0].password)) {
      let user = User.find(
        { username: data.username, password: result[0].password },
        { username: 1, _id: 0 }
      )
        .select("username")
        .exec();
      user.then((result) => {
        if (result.length === 1) {
          let newPassword = User.updateOne(
            { username: data.username },
            { password: bcrypt.hashSync(data.newPassword, 10) }
          );
          newPassword.then((result) => {
            res.status(200).send({ status: 200 });
          });
        } else {
          res.status(400).send({ status: 400 });
        }
      });
    } else {
      res.status(400).send({ status: 400 });
    }
  });
});

app.post("/api/settings/photo", (req, res) => {
  let data = req.body;
  let type = data.photo.split("/")[1].split(";")[0];
  let image = Buffer.from(data.photo.split(",")[1], "base64");
  let user = User.findOneAndUpdate(
    { username: data.username },
    { photo: image, typePhoto: type }
  );
  user.then((result) => {
    res.status(200).send({ status: 200 });
  });
});

app.post("/api/settings/unsubscribe", (req, res) => {
  let data = req.body;
  let user = User.findOneAndDelete({ username: data.username });
  user.then((result) => {
    res.status(200).send({ status: 200 });
  });
});

// Start server
app.listen(5000);
