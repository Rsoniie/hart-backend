// models/UserResponse.js
const mongoose = require('mongoose');

const userResponseSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  responses: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('UserResponse', userResponseSchema);
