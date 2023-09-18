const express=require('express');
//for use of .env file
const dotenv=require('dotenv').config();
const { error } = require('./middleware/error');
const mongoose=require('mongoose');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const Router=require('./Router');
//connect to DB
mongoose.connect("mongodb+srv://Arpit:Ab123@cluster0.j4fl22k.mongodb.net/assignment",{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con=>{console.log("connnected")});
const app=express();
app.use(cookieParser());app.use(express.json());
//So that from cilent side we can get requestion form any url
app.use(cors({
  origin:['http://localhost:5173','*','https://6508b08e0c4f2c4de104c14a--candid-biscotti-e585a2.netlify.app'],
  credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.urlencoded({ extended: false }));
//for cookies to send to cilent to store in their browser

app.use('/game',Router);
//global error middleware so when ever it hit throw new error it comes to this middlware
app.use(error);
app.listen(process.env.PORT,()=>{console.log(`Listening on port ${process.env.PORT}`)})
