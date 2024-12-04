const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email:String,
    password:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports= mongoose.model('Student',studentSchema,'students');