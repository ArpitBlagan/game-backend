const express=require('express');
//for use of .env file
const dotenv=require('dotenv').config();
const { error } = require('./middleware/error');
const mongoose=require('mongoose');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const Router=require('./Router');
//connect to DB
mongoose.connect(process.env.URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con=>{console.log("connnected")});
const app=express();
app.use(cookieParser());app.use(express.json());
//So that from cilent side we can get requestion form any url
app.use(cors({
  origin:['http://localhost:5173','*'],
  credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.urlencoded({ extended: false }));
//for cookies to send to cilent to store in their browser

app.use('/game',Router);
//global error middleware so when ever it hit throw new error it comes to this middlware
app.use(error);
app.listen(process.env.PORT,()=>{console.log(`Listening on port ${process.env.PORT}`)})