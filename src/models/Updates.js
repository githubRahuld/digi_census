const mongoose = require("mongoose");

//creating a schema
const updateSchema = new mongoose.Schema({

    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique:true
    },
    Age:{
        type: String,
        require: true
    },
    aadhar:{
        type:Number,
        require:true
    },
    q1: {
        type: String, possibleValues: ['Yes','No'],
        require : true
    },
    q2: {
        type: String, possibleValues: ['Zero', 'One', 'Two', 'Three or more'],
        require : true
    },
    q3: {
        type: String, possibleValues: ['One', 'Two', 'Three','Four or more'],
        require : true
    },
    q4: {
        type: String, possibleValues: ['1 to 3', '4 to 5', '6 to 10' ,'11 to 20'],
        require : true
    },
    q5: {
        type: String, possibleValues: ['Yes','No'],
        require : true
    },
    q6: {
        type: String, possibleValues: ['2000 to 10000' ,'11000 to 20000', '21000 to 35000', '36000 to 50000' ,'510000+'],
        require : true
    },
    q7: {
        type: String, possibleValues: ['One', 'Two', 'Three','Four or more'],
        require : true
    },
    q8: {
        type: String, possibleValues: ['One', 'Two', 'Three or more'],
        require : true
    },
    Date:{
        type: Date
    }
})

//define model that is to create collection

const Update = new mongoose.model("Update",updateSchema);


//export
module.exports = Update;