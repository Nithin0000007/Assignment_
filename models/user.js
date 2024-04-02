const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
    mobNo:Number,
    username: String,
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user',userSchema)