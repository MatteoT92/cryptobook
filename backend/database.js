const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users");

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  messages: [{
    receiver: String,
    message: String, 
    date: Date
  }]
});

const User = mongoose.model('User', usersSchema);

module.exports = User;