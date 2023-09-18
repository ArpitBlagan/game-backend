const express=require('express');
const {validate}=require('./middleware/validate');
const {register,logIn,logOut, getScore, scoreBoard, delScore, uploadedQuestion,updateQuestion}=require('./controllers/userC');
const {addQues, getQues, checkAns}=require('./controllers/ques');
const Router=express.Router();
//All the route 
Router.route('/register').post(register);
Router.route('/login').post(logIn);
Router.route('/logout').get(logOut);
Router.route('/board').get(scoreBoard);
//after validate one  all the route will have to go through validate middleware first 
Router.use(validate);
Router.route('/add').post(addQues);
Router.route('/ques').post(getQues);
Router.route('/check').post(checkAns);
Router.route('/score').get(getScore);
Router.route('/reset').get(delScore);
Router.route('/uploads').get(uploadedQuestion).put(updateQuestion)

module.exports=Router;