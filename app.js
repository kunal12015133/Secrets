const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
require("dotenv").config();
// const md5 = require('md5');   
const bcrypt = require('bcrypt');


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
   extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = mongoose.model("User", userSchema);




app.get("/", function (req, res) {
   console.log(process.env.SECRET)
   res.render("home");

})

app.get("/login", function (req, res) {

   res.render("login");

})

app.get("/register", function (req, res) {
   res.render("register");

})


app.get("/logout", function (req, res) {
   res.redirect("/login")

})

app.post("/register", function (req, res) {
   bcrypt.hash(req.body.password,10,(err,hash)=>{
      if(!err){
         const newUser = new User({
            email: req.body.username,
            // password: md5(req.body.password)
            password: hash
         });
      
         newUser.save(function (err) {
            if (!err) {
               res.render('secrets');
            }
            else {
               console.log(err);
            }
         })
      }
      else console.log(err)
   })
})

app.post("/login", function (req, res) {
   const username = req.body.username;
   // const password = md5(req.body.password) ;
   const password = req.body.password ;

   User.findOne({ email: username }, function (err, foundUser) {
      if (err) console.log(err);
      else if (foundUser) {
         bcrypt.compare(password,foundUser.password,(err,result)=>{
            if(result)
            {
               res.render("secrets")
            }
         })
      }
      else console.log("No user found");
   })


})

app.listen(3000, function () {
   console.log("server started at port 3000");
})