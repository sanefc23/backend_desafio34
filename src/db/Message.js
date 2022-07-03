const mongoose = require("mongoose");
require('mongoose-type-email');

const Schema = mongoose.Schema;

const messagesCollection = 'mensajes';

const messageSchema = new Schema({
    author: {
        type: {
            email: { type: mongoose.SchemaTypes.Email, required: true },
            name: { type: String, required: true, max: [30, "Max length is 30 characters"] },
            lastName: { type: String, required: true, max: [30, "Max length is 30 characters"] },
            age: { type: Number, required: true },
            alias: { type: String, required: true, max: [30, "Max length is 400 characters"] },
            avatar: { type: String, required: true, max: [30, "Max length is 400 characters"] }
        }
    },
    text: { type: String, required: true, max: [400, "Max length is 400 characters"] },
    timeStamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model(messagesCollection, messageSchema);