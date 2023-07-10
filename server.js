require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || '5000';

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// express-session must be used before passport
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://anand:mongoanand@cluster0.sav13b5.mongodb.net/todo").then(()=>{
    console.log('DATABASE CONNECTED!')
}).catch((e)=>{
    console.log("Error: ",e)
});


const todoRouter = require('./Router/todoRouter');
const AuthRouter = require('./Router/AuthRouter');

app.use('/', AuthRouter);
app.use('/home/', todoRouter);


app.listen(5000, function(){
    console.log("Server is running at port: "+port);
})