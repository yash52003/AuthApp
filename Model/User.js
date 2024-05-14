const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    email:{
        type : String,
        required : true,
        trim : true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum: ["Admin" , "Student" , "Visitor"],
    }
});

module.exports = mongoose.model("user" , userSchema);

/*
For making the schema we require 2 things 
1 - Name of the schema
2 - Model
we form the schema using the mongoose instance
*/

