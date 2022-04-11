const {Schema, model} = require("mongoose")

const UserSchema = new Schema({
    username: {type: String, required: true, min: 3, max: 20, unique: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model("User", UserSchema)