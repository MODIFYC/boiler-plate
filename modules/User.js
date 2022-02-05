const mongoose = require("mongoosse");

const userSchema = mongoose.Schema({

name: {

    type: String,

    maxlength: 50

},

email: {

    type: String,

    trim: true,

    unique: 1

},

password: {

    type: String,

    minlength:5

},

lastname: {

    type: String,

    maxlength: 50

},

role: {

    type: Number,

    default: 0

},

imgae: String,

token:{

    type: String    

},

tokenExp:{

    type: Number

}

})

const User = mongoose.model('User', userSchema)

// 다른 곳에서 사용 가능하도록

module.exports = { User }