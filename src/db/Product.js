const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productsCollection = 'productos';

const productSchema = new Schema({
    title: {type: String, required: true, max: [125, "Max length is 125 characters"]},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true, max: [400, "Max length is 400 characters"]},
});

module.exports = mongoose.model(productsCollection, productSchema);

