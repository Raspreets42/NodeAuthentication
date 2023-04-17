const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: [true , "Email Required"],
        unique: true,
    },
    userPhone: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userCPassword: {
        type: String,
        required: true
    },    
},
{
    collection: 'users'
});

const model = mongoose.model('userSchema' , userSchema);

module.exports = model;