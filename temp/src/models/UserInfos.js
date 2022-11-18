const  mongoose  = require("mongoose");
const conn= require('../db/conn')
var infoSchema = new mongoose.Schema({
    Q1:{
        type:String,
        require:true,
        
    },
    Q2:{
        type:String,
        require:true
    },
    Q3:{
        type:String,
        require:true
    },
    Q4:{
        type:String,
        require:true
    },
    Q5:{
        type:String,
        require:true
    },
    Q6:{
        type:String,
        require:true
    },
    Q7:{
        type:String,
        require:true
    },
    Q8:{
        type:String,
        require:true
    },

    

 
}) 

let UserInfo = new mongoose.model('userinfo',infoSchema,'userinfo');
// const Otp = new mongoose.model("Otp",otpSchema);


//export
module.exports = UserInfo;