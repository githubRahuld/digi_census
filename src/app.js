const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();

require("./db/conn");
const Register = require("./models/Registers")
const Otp = require("./models/Otps");
const Insert = require("./models/Inserts");
const { response } = require("express");

const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname,"../public");
const templatePath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");


//to get user data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath);

app.get("/",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login", (req,res)=>{
    res.render("login");
})


//create a new user in our database
app.post("/register",async (req,res)=>{

    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        console.log(req.body.email);
        console.log(password);
        if(password === cpassword){
            console.log("Pass matched");

            const userRegister = new Register({
                email : req.body.email,
                password : password,
                cpassword : cpassword
            })
            const registered  = await userRegister.save();
            res.status(201).render("index");
        }else{
            console.log("Password Not Matching!");
        }

      
    } catch (error) {
        res.status(400).send(error);
    } 
})


//login check 
app.post("/login", async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        //  console.log(`${email} and ${password}`);

        // userEmail contail all the data of user like email and pass 
        const userEmail = await Register.findOne({email:email});
        // res.send(userEmail );

        if(userEmail.password === password){
            res.status(201).render("otpSend");
        }else{
            res.status(400).send("Invalid Password")
        }

    } catch (error) {
        res.status(400).send("Invalid Mail");
    }
})


//send otp
const mailer = (email,Otp)=>{
        var nodemailer = require('nodemailer');
        
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '201b205@juetguna.in',
            pass: 'vygx pxtq xhau zpzg'
        }
    });

    var mailOptions = {
        from: '201b205@juetguna.in',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `Your otp is:  ${Otp}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//create otp

app.post("/otpsend",async (req,res)=>{

         
            try {
                const email = req.body.email;
                // console.log(email);
            
                
                const data = await Register.findOne({email:email});
                const responseType = {};
                if(data){

                    let otpCode = Math.floor((Math.random()*10000)+1);
                    console.log(`OTP is :${otpCode}`);

                    const otpData = new Otp({ //to save otp in database
                        email:email,
                        code:otpCode,
                        expireIn:new Date().getTime()+ 60*1000 //otp expire in 2 min
                    })
                    
                    const otpResponse = await otpData.save();
                    console.log(otpResponse);
                    responseType.statusText = "Sucess"
            
                    mailer(email,otpCode);

                    responseType.message = "Please check your email Id";
                    console.log(responseType.message);

                    res.status(201).render("confirmOtp");
                
                }else{
                    responseType.statusText = 'Error'
                    responseType.message = "Email Id not Exits";
                }
    
            } catch (error) {
                res.send(404).send("Something went wrong with mail")
            }
})

//confirm otp 
app.post("/confirmOtp", async(req,res)=>{
    
    try {
        console.log("After otp send");
        const OTP = req.body.otp;
        console.log(`you typed : ${OTP}`);
    
    
        let otpData = await Otp.findOne({code:OTP});
    
        // console.log(otpData.code);
        if(otpData.code===OTP){

            //for otp expire
            let currentTime = new Date().getTime();
            console.log(currentTime);
            let diff = otpData.expireIn - currentTime;
            if(diff<0){
                res.send("OTP expire")
            }else{

                res.status(201).render("home");
            }

        }else{
            res.status(400).send("Otp is not correct");
        }

    } catch (error) {
        res.status(404).send("OTP is not correct")
    }
})

//insert user details
app.post("/insert", async (req,res) => {

        const responseType = {};
        const name = req.body.name;
        const email = req.body.email;
        const age = req.body.age;
        const aadhar = req.body.aadhar;

    try {
        
        const que1 = req.body.recommed_q1;
        const que2 = req.body.recommed_q2;
        const que3 = req.body.recommed_q3;
        const que4 = req.body.recommed_q4;
        const que5 = req.body.recommed_q5;
        const que6 = req.body.recommed_q6;
        const que7 = req.body.recommed_q7;
        const que8 = req.body.recommed_q8;


        // console.log(que1);
        // console.log(que2);
        // console.log(que3);
        // console.log(que4);
        // console.log(que5);
        // console.log(que6);
        // console.log(que7);
        // console.log(que8);

     
        const userData = new Insert({

            name: name,
            email: email,
            age: age,
            aadhar: aadhar,
            q1: que1,
            q2: que2,
            q3: que3,
            q4: que4,
            q5: que5,
            q6: que6,
            q7: que7,
            q8: que8,
            Date:new Date().getTime(),
      
        })

        const userDetails = await userData.save();
        // console.log(userDetails);
        responseType.statusText = "Sucess"

        res.status(201).render("home");

    } catch (error) {
        res.status(404).send("something went wrong");
        console.log(error);
    }
})

//Update User Details
app.post("/update",async (req,res) => {

    try {
        const email = req.body.email;
        const name = req.body.name;
        const age = req.body.age;
        const aadhar = req.body.aadhar;
        
        const data = await Register.findOne({email:email});


        const que1 = req.body.recommed_q1;
        const que2 = req.body.recommed_q2;
        const que3 = req.body.recommed_q3;
        const que4 = req.body.recommed_q4;
        const que5 = req.body.recommed_q5;
        const que6 = req.body.recommed_q6;
        const que7 = req.body.recommed_q7;
        const que8 = req.body.recommed_q8;

        const responseType = {};
        if(data.email===email){
            
            const upadateData = new Insert({
    
                q1: que1,
                q2: que2,
                q3: que3,
                q4: que4,
                q5: que5,
                q6: que6,
                q7: que7,
                q8: que8,
                Date:new Date().getTime(),
                name: name,
                age: age,
                email:email,
                aadhar:aadhar
            })
            const userDetails = await upadateData.save();
            console.log(userDetails);
            responseType.statusText = "Sucess"
        }else{
            res.status(404).send("User Not Found!");           
        }

        res.status(201).render("home");

    } catch (error) {
        res.status(404).send("User Not Found!");                              
        console.log(error);
    }

})
//Dashboard
app.get("/dashboard",async(req,res)=>{

    const data = await Insert.findOne(email);

    res.render('dashboard',{
        Name: data.name
    });
    
})

app.listen(port,()=>{
    console.log(`listening to the port: ${port}`);
})