const mongoose = require("mongoose")
//const { modelName } = require("./ProductModel")

const reviewSchema = mongoose.Schema({
    comment: {type: String, require: true}, 
    rating: {type: Number, require: true},
    user:{
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        name: {type: String, required: true}
    }
}, {
    timestamps: true,
})
const Review = mongoose.model("Review", reviewSchema)
module.exports = Review