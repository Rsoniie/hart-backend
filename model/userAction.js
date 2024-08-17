const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    firebaseUid: String, // The Firebase UID of the user who performed the action
    targetFirebaseUid: String, // The Firebase UID of the user the action is performed on
    actionType: String,  // 'like', 'remove', 'report'
    timestamp: Date,
    reply: String,
    prompts: {}
});

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;
