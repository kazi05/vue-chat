const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    text: { type: String, required: true },
    textColor: { type: String },
    time: { type: Date, required: true }
}, {
    versionKey: false
});

module.exports = mongoose.model('Message', messageSchema);