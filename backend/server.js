// Create server
const express = require("express");
const app = express();

// Database MongoDB
const { User, Message, Chat, Comment, Post } = require("./database");

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
  let passwordEncrypted = User.find({ username: data.username }, { password: 1, _id: 0 })
    .select("password")
    .exec();
  passwordEncrypted.then((result) => {
    if (result.length === 1 && bcrypt.compareSync(data.password, result[0].password)) {
      let user = User.find({ username: data.username, password: result[0].password }, { username: 1, _id: 0 })
        .select("username")
        .exec();
      user.then((result) => {
        if (result.length === 1) {
          res.send(result[0]);
        } else {
          res.send({ message: "Invalid username or password" });
        }
      });
    } else {
      res.send({ message: "Invalid username or password" });
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
    const sender = await User.findOne({ username: msg.sender }, { _id: 1 }).select("_id").exec();
    const receiver = await User.findOne({ username: msg.receiver }, { _id: 1 }).select("_id").exec();
    let chat = await Chat.findOne({$and: [{ members: sender._id }, { members: receiver._id }]}).exec();
    if (!chat) {
      chat = new Chat({ members: [sender._id, receiver._id]});
      await chat.save();
    }
    const message = new Message({
      sender: sender._id,
      receiver: receiver._id,
      message: msg.message,
    });
    chat.messages.push(message);
    await chat.save();
    res.send({ status: 200 });
  } catch (err) {
    res.send({ status: 500 });
  }
});

app.post("/api/post/encrypt", (req, res) => {
  let post = req.body;
  let cipherText = AES.encrypt(post.message, post.key).toString();
  res.send({ message: cipherText });
});

app.post("/api/post/decrypt", (req, res) => {
  let post = req.body;
  let decryptedText = AES.decrypt(post.message, post.key).toString(enc.Utf8);
  if (decryptedText.length > 0) {
    res.send({ message: decryptedText });
  } else {
    res.send({ message: post.message });
  }
});

app.post("/api/post/send", async (req, res) => {
  let post = req.body;
  try {
    const author = await User.findOne({ username: post.author }, { friends: 1, _id: 1 }).select("friends _id").exec();
    const postToShare = new Post({
      author: author._id,
      content: post.content,
      visibleTo: author.friends.map((friend) => friend.user)
    });
    await postToShare.save();
    res.send({ status: 200 });
  } catch (err) {
    res.send({ status: 500 });
  }
});

app.post("/api/comment/encrypt", (req, res) => {
  let comment = req.body;
  let cipherText = AES.encrypt(comment.message, comment.key).toString();
  res.send({ message: cipherText });
});

app.post("/api/comment/decrypt", (req, res) => {
  let comment = req.body;
  let decryptedText = AES.decrypt(comment.message, comment.key).toString(enc.Utf8);
  if (decryptedText.length > 0) {
    res.send({ message: decryptedText });
  } else {
    res.send({ message: comment.message });
  }
});

app.post("/api/comment/send", async (req, res) => {
  let comment = req.body;
  try {
    const author = await User.findOne({ username: comment.author }, {  _id: 1 }).select("_id").exec();
    const post = await Post.findOne({ _id: comment.idPost }, { comments: 1 }).select("comments").exec();
    const commentToPost = new Comment({
      author: author._id,
      content: comment.content
    });
    post.comments.push(commentToPost);
    await post.save();
    res.send({ status: 200 });
  } catch (err) {
    res.send({ status: 500 });
  }
});

app.get("/api/posts", async (req, res) => {
  let data = req.query;
  let user = await User.findOne({ username: data.user }, { _id: 1 }).select("_id").exec();
  let posts = await Post.find({}, { visibleTo: 0 })
    .where("visibleTo").in([user._id])
    .populate("author", "username")
    .select("author content date comments _id")
    .exec();
  res.send(posts);
});

app.get("/api/posts/:user", async (req, res) => {
  let data = req.params;
  let user = await User.findOne({ username: data.user }, { _id: 1 }).select("_id").exec();
  let posts = await Post.find({}, { visibleTo: 0 })
    .where("author").equals(user._id)
    .populate("author", "username")
    .select("author content date comments _id")
    .exec();
  res.send(posts);
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
  let userId = await User.findOne({ username: data.user }, { _id: 1 }).exec();
  let friendId = await User.findOne({ username: data.friend }, { _id: 1 }).exec();
  let user = await User.findOneAndUpdate(
    { username: data.user },
    { $pull: { friends: { user: friendId._id } } },
    { new: true }
  ).exec();
  let friend = await User.findOneAndUpdate(
    { username: data.friend },
    { $pull: { friends: { user: userId._id } } },
    { new: true }
  ).exec();
  let userFriends = user.friends.some(
    (userFriend) => userFriend.user.toString() === friendId._id.toString()
  );
  let friendFriends = friend.friends.some(
    (friendFriend) => friendFriend.user.toString() === userId._id.toString()
  );
  if (userFriends && friendFriends) {
    res.send({ status: 400 });
  } else if (!userFriends && !friendFriends) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 400 });
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

app.delete("/api/settings/unsubscribe", (req, res) => {
  let data = req.body;
  let user = User.findOneAndDelete({ username: data.username });
  user.then((result) => {
    res.status(200).send({ status: 200 });
  });
});

app.get("/api/users", async (req, res) => {
  let user = await User.findOne({username: req.query.exclude}, { username: 1, friends: 1, followRequests: 1, _id: 0 })
    .populate("friends.user", "username")
    .populate("followRequests.sended", "username")
    .populate("followRequests.received", "username")
    .select("username friends followRequests")
    .exec();
  let users = await User.find({}, { username: 1, _id: 0 })
    .select("username")
    .exec();
  const excludedUser = [user].map(
    (user) => user.username
  );
  const excludedFriends = user.friends.map(
    (friend) => friend.user.username
  );
  const excludedRequestsSended = user.followRequests.sended.map(
    (request) => request.username
  );
  const excludedRequestsReceived = user.followRequests.received.map(
    (request) => request.username
  );
  users = users.filter((userItem) => {
    return !excludedUser.includes(userItem.username);
  });
  users = users.filter((userItem) => {
    return !excludedFriends.includes(userItem.username);
  });
  users = users.filter((userItem) => {
    return !excludedRequestsSended.includes(userItem.username);
  });
  users = users.filter((userItem) => {
    return !excludedRequestsReceived.includes(userItem.username);
  });
  res.send(users);
});

app.post("/api/users", async (req, res) => {
  let data = req.body;
  let sender = await User.find(
    { username: data.sender },
    { followRequests: 1, _id: 1 }
  )
    .select("followRequests")
    .exec();
  let receiver = await User.find(
    { username: data.receiver },
    { followRequests: 1, _id: 1 }
  )
    .select("followRequests")
    .exec();
  sender[0].followRequests.sended.push(receiver[0]._id);
  await sender[0].save();
  receiver[0].followRequests.received.push(sender[0]._id);
  await receiver[0].save();
  res.send({ status: 200 });
});

app.get("/api/users/:user/followrequests/sended", async (req, res) => {
  let data = req.params;
  let requestSended = await User.find(
    { username: data.user },
    { followRequests: 1, _id: 1 }
  )
    .populate("followRequests.sended", "username")
    .select("followRequests")
    .exec();
  res.send(requestSended[0].followRequests.sended);
});

app.delete("/api/users/:user/followrequests/sended", async (req, res) => {
  let data = req.body;
  let userId = await User.findOne({ username: req.params.user }, { _id: 1 }).exec();
  let friendId = await User.findOne({ username: data.friend }, { _id: 1 }).exec();
  let user = await User.findOneAndUpdate(
    { username: req.params.user },
    { $pull: { "followRequests.sended": friendId._id } },
    { new: true }
  );
  let friend = await User.findOneAndUpdate(
    { username: data.friend },
    { $pull: { "followRequests.received": userId._id } },
    { new: true }
  );
  let requestSended = user.followRequests.sended.some(
    (reqSended) => reqSended._id.toString() === friendId._id.toString()
  );
  let requestReceived = friend.followRequests.received.some(
    (reqReceived) => reqReceived._id.toString() === userId._id.toString()
  );
  if (requestSended && requestReceived) {
    res.send({ status: 400 });
  } else if (!requestSended && !requestReceived) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 400 });
  }
});

app.get("/api/users/:user/followrequests/received", async (req, res) => {
  let data = req.params;
  let requestReceived = await User.find(
    { username: data.user },
    { followRequests: 1, _id: 1 }
  )
    .populate("followRequests.received", "username")
    .select("followRequests")
    .exec();
  res.send(requestReceived[0].followRequests.received);
});

app.post("/api/users/:user/followrequests/received", async (req, res) => {
  let data = req.body;
  let userId = await User.findOne({ username: req.params.user }, { _id: 1 }).exec();
  let friendId = await User.findOne({ username: data.friend }, { _id: 1 }).exec();
  let user = await User.findOneAndUpdate(
    { username: req.params.user },
    { $push: { friends: {user: friendId._id} }, $pull: { "followRequests.received": friendId._id } },
    { new: true }
  );
  let friend = await User.findOneAndUpdate(
    { username: data.friend },
    { $push: { friends: {user: userId._id} }, $pull: { "followRequests.sended": userId._id } },
    { new: true }
  );
  let requestReceived = user.followRequests.received.some(
    (reqReceived) => reqReceived._id.toString() === friendId._id.toString()
  );
  let userFriends = user.friends.some(
    (f) => f.user.toString() === friendId._id.toString()
  );
  let requestSended = friend.followRequests.sended.some(
    (reqSended) => reqSended._id.toString() === userId._id.toString()
  );
  let friendFriends = friend.friends.some(
    (f) => f.user.toString() === userId._id.toString()
  );
  if (requestReceived && !userFriends && requestSended && !friendFriends) {
    res.send({ status: 400 });
  } else if (!requestReceived && userFriends && !requestSended && friendFriends) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 400 });
  }
});

app.delete("/api/users/:user/followrequests/received", async (req, res) => {
  let data = req.body;
  let userId = await User.findOne({ username: req.params.user }, { _id: 1 }).exec();
  let friendId = await User.findOne({ username: data.friend }, { _id: 1 }).exec();
  let user = await User.findOneAndUpdate(
    { username: req.params.user },
    { $pull: { "followRequests.received": friendId._id } },
    { new: true }
  );
  let friend = await User.findOneAndUpdate(
    { username: data.friend },
    { $pull: { "followRequests.sended": userId._id } },
    { new: true }
  );
  let requestReceived = user.followRequests.received.some(
    (reqReceived) => reqReceived._id.toString() === friendId._id.toString()
  );
  let requestSended = friend.followRequests.sended.some(
    (reqSended) => reqSended._id.toString() === userId._id.toString()
  );
  if (requestReceived && requestSended) {
    res.send({ status: 400 });
  } else if (!requestReceived && !requestSended) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 400 });
  }
});

app.get("/api/users/:user", async (req, res) => {
  let user = await User.findOne({ _id: req.params.user }, { username: 1 }).exec();
  res.send(user);
});

app.get("/api/users/:user/:friend", async (req, res) => {
  let friendToSearch = await User.findOne(
    { username: req.params.friend },
    { _id: 1 }
  ).exec();
  let user = await User.findOne(
    { username: req.params.user },
    { username: 1, followRequests: 1, friends: 1, _id: 1 }
  ).exec();
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
  res.send({
    isFriend: isFriend,
    isFollowRequestSended: isFollowRequestSended,
    isFollowRequestReceived: isFollowRequestReceived
  });
});

// Start server
app.listen(5000);
