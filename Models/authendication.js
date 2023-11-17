const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
