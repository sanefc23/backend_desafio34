const mongoose = require("mongoose");
require('mongoose-type-email');

const Schema = mongoose.Schema;

const usersCollection = 'users';

const usersSchema = new Schema({
    email: { type: mongoose.SchemaTypes.Email, required: true },
    name: { type: String, required: true, max: [30, "Max length is 30 characters"] },
    lastName: { type: String, required: true, max: [30, "Max length is 30 characters"] },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model(usersCollection, usersSchema);