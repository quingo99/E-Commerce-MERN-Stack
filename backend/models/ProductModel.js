const mongoose = require("mongoose")
const Reviews = require("./ReviewModel")
const imageValidate = require("../utils/imageValidate")

const imageSchema = mongoose.Schema({
    path: {type: String, required: true}
})

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
    reviewsNumber: {
        type: Number,
    },
    sales: {
        type: Number,
        default: 0
    },
    attrs: [
        {key: {type: String}, value: {type: String}}
        // [{ key: "color", value: "red" }, { key: "size", value: "1 TB" }]
    ],
    images: [imageSchema],
    reviews: [{
        //create a connection to Reviews
        //this one right here like forgein key to review collection
        type: mongoose.Schema.Types.ObjectId,
        //refence to what collection
        ref: Reviews
    }]
}, {
    //this one will save in database as date update or create the product
    timestamps: true,
})
productSchema.index({name: "text", description: "text"}, {name: "TextIndex"})
productSchema.index({"attrs.key": 1, "attrs.value": 1})
const Product = mongoose.model("Product", productSchema)

module.exports = Product
