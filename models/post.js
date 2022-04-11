const {Schema, model} = require("mongoose")

const PostSchema = new Schema({
    desc: {
        type: String,
        required: true,
        max: 500
    },
    img: {
        type: String
    }
    
}, { timestamps: true })

module.exports = model("Post", PostSchema)