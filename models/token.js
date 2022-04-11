const {Schema, model} = require("mongoose")

const TokenSchema = new Schema({
    user: {type: String},
    refreshToken: {type: String, required: true}
})

module.exports = model("Token", TokenSchema)