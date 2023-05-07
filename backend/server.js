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
    .populate("friends.user", "username")
    .select("friends")
    .exec();
  friends.then((result) => {
    res.send(result[0]);
  });
});

app.post("/api/friends", async (req, res) => {
  let data = req.body;
  let friend = await User.findOne({ username: data.friend }, { _id: 1 }).exec();
  let user = await User.findOneAndUpdate({ username: data.user }, { $pull: { friends: { user: friend._id } } }, { new: true }).exec();
  let friends = user.friends.map(f => f.user.toString() === friend._id.toString());
  if (friends.length > 0) {
    res.send({ status: 400 });
  } else {
    res.send({ status: 200 });
  }
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

app.get("/api/users", async (req, res) => {
  let users = await User.find({}, { username: 1, _id: 0 }).select("username").exec();
  res.send(users);
});

app.post("/api/users", async (req, res) => {
  let data = req.body;
  let sender = await User.find({username: data.sender}, { followRequests: 1, _id: 1})
    .select("followRequests").exec();
  let receiver = await User.find({username: data.receiver}, { followRequests: 1, _id: 1})
    .select("followRequests").exec();
  sender[0].followRequests.sended.push(receiver[0]._id);
  await sender[0].save();
  receiver[0].followRequests.received.push(sender[0]._id);
  await receiver[0].save();
  res.send({ status: 200 });
});

app.get("/api/users/:user/followrequests/sended", async (req, res) => {
  let data = req.params;
  let requestSended = await User.find({username: data.user}, { followRequests: 1, _id: 1})
    .populate("followRequests.sended", "username")
    .select("followRequests")
    .exec();
  res.send(requestSended[0].followRequests.sended);
});

app.get("/api/users/:user/followrequests/received", async (req, res) => {
  let data = req.params;
  let requestReceived = await User.find({username: data.user}, { followRequests: 1, _id: 1})
    .populate("followRequests.received", "username")
    .select("followRequests")
    .exec();
  res.send(requestReceived[0].followRequests.received);
});

app.get("/api/users/:user/:friend", async (req, res) => {
  let friendToSearch = await User.findOne({username: req.params.friend}, { _id: 1}).exec();
  let user = await User.findOne({username: req.params.user}, { username: 1, followRequests: 1, friends: 1, _id: 1}).exec();
  let isFriend = false;
  let isFollowRequestSended = false;
  let isFollowRequestReceived = false;
  user.friends.filter((friend) => {
    if (friendToSearch._id.toString() === friend.user.toString()) {
      isFriend = true;
      return isFriend;
    }
  });
  user.followRequests.sended.filter((friend) => {
    if (friendToSearch._id.toString() === friend._id.toString()) {
      isFollowRequestSended = true;
      return isFollowRequestSended;
    }
  });
  user.followRequests.received.filter((friend) => {
    if (friendToSearch._id.toString() === friend._id.toString()) {
      isFollowRequestReceived = true;
      return isFollowRequestReceived;
    }
  });
  res.send({isFriend: isFriend, isFollowRequestSended: isFollowRequestSended, isFollowRequestReceived: isFollowRequestReceived });
});

// Start server
app.listen(5000);
