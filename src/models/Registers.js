const mongoose = require("mongoose");

//creating a schema
const userSchema = new mongoose.Schema({

    email:{
        type: String,
        require: true,
        unique:true
    },
    password:{
        type: String,
        require: true
    }
})

//define model that is to create collection

const Register = new mongoose.model("Register",userSchema);


//export
module.exports = Register;