const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users");

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  photo: Buffer,
  typePhoto: String,
  friends: [{
    username: String
  }]
});

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }, 
  date: {
    type: Date,
    default: new Date().toISOString()
  }
});

const chatSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema]
});

const User = mongoose.model('User', usersSchema);
const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);

module.exports = {User, Chat};