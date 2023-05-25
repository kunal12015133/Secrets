 const express = require('express');
 const bodyParser = require('body-parser');
 const ejs = require('ejs');
 const mongoose = require('mongoose');
 const encrypt = require('mongoose-encryption');

 const app= express();
 app.use(express.static("public"));
 app.set("view engine","ejs");
 app.use(bodyParser.urlencoded({
    extended:true
 }))

 mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser : true});

 const userSchema = new mongoose.Schema({
    email : String,
    password : String
 });
//  const secret = "Thisisourlittlesecret.";
//  userSchema.plugin(encrypt,{secret:secret , encryptedFields:['password']});
 const User = mongoose.model("User",userSchema);

const secretSchema= new mongoose.Schema({
   secret: String
});
const Secret = mongoose.model("Secret",secretSchema);


 app.get("/",function(req,res){
    res.render("home");

 })

 app.get("/login",function(req,res){
    res.render("login");

 })

 app.get("/register",function(req,res){
    res.render("register");

 })


 app.get("/logout",function(req,res){
    res.redirect("/login")

 })

 
 app.get("/submit",function(req,res){
    res.render("submit")

 })

 app.post("/submit",function(req,res){
   const sec = new Secret({
      secret:req.body.secret
   })
   sec.save(function(err){
      if(!err){
         res.send("Secret Submitted")
      }
      else {
         res.send(err);
      }
   })
 })

 

 app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            res.render('secrets');
        }
        else{
            console.log(err);
        }
    })
 })



 app.post("/login",function(req,res){
   const username = req.body.username;
   const password = req.body.password;

   User.findOne({email:username},function(err,foundUser){
      if(err) console.log(err);
      else if(foundUser){
         // console.log(foundUser.password);
         if(foundUser.password===password)
         {
            Secret.find({}).then(SecretArray=>res.render("secrets" , {data : SecretArray}))
         }
         else res.send("Invalid credentials")
      }
      else res.send("User not exits");
   })


 })

 app.listen(3000,function(){
    console.log("server started at port 3000");
 })