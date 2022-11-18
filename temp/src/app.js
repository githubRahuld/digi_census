const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();

require("./db/conn");
const Register = require("./models/Registers")
const Otp = require("./models/Otps");
const { response } = require("express");

const port = process.env.PORT || 8000;

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

         
            const email = req.body.email;
            // console.log(email);
        
            const data = await Register.findOne({email:email});
            const responseType = {};
            if(data.email === email){

                const otpCode = Math.floor((Math.random()*10000)+1);
                // console.log(otpCode);

                const otpData = new Otp({ //to save otp in database
                    email:email,
                    code:otpCode,
                    expireIn:new Date().getTime()+ 300*1000
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
    
})

//confirm otp 
app.post("/confirmOtp", async(req,res)=>{
    
    const OTP = req.body.otp;
    console.log(OTP);

    const data = await Otp.findOne({otp:OTP});
    console.log(data);
    if(data){
            res.status(201).render("home");
    }else{
        res.status(400).send("Otp is not correct");
    }
})

//insert user details
app.post("/insert",async (req,res)=>{
    

})


app.listen(port,()=>{
    console.log(`listening to the port: ${port}`);
})