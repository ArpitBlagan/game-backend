const asyncHandler=require('express-async-handler');
const qDB=require('../models/questions');
const userDB=require('../models/user');
exports.addQues=asyncHandler(async(req,res)=>{
    //Controller for adding question which only done by the user who register as admin
    //get below info from the admin
    const {language,difficulty,question,ans,options}=req.body;
    //get the user id who is adding question
    const user_id=req.user.id;
    console.log("hitting");
    //create the question in DB
    const ques=await qDB.create({user_id,language,difficulty,question,ans,options});
    if(ques){
        res.status(202).json({message:"Added"});
    }
    else{
        res.status(404);throw new Error("Something went wrong please try again");
    }
});
function getRandomQuestions(questions, numberOfQuestions) {
    //Function to generate random five question out of question array
    const selectedQuestions = [];
    const totalQuestions = questions.length;
  
    if (numberOfQuestions >= totalQuestions) {
      // Handle the case where you want more questions than available.
      return questions;
    }
    //this loop will run until we get out target no of questions
    while (selectedQuestions.length < numberOfQuestions) {
      const randomIndex = Math.floor(Math.random() * totalQuestions);
      const randomQuestion = questions[randomIndex];
    // to only select the unique questions
      if (!selectedQuestions.includes(randomQuestion)) {
        selectedQuestions.push(randomQuestion);
      }
    }
    return selectedQuestions;
  }
exports.getQues=asyncHandler(async(req,res)=>{

    //get this info from user
    const {difficulty,language}=req.body;
    //send the question when user score good marks in its previous tests
    if(difficulty>1){
        console.log('ok');
        const id=req.user.id;
        const user=await userDB.findById(id);
        const arr=user.score;
        if(arr.length==0){
            return res.status(200).json({
                message:"Not eligible"
            });
        }
        const val=parseInt((difficulty*5)/2);
        let ff='false'
        for(let i=0;i<arr.length;i++){
            if(arr[i].difficulty===(difficulty-1)){
                ff='true';
                if(arr[i].score<val){
                    return res.status(200).json({
                        message:"Not eligible"
                    });
                }
            }
        }
        if(ff=='false'){
            return res.status(200).json({
                message:"Not eligible"
            });
        }
    }
    //fint the array of question which matches there required fields
    const questions=await qDB.find({difficulty,language});
    //than generate the random five question from questions array that we just find
    const randomQuestions=getRandomQuestions(questions,5);
    if(!questions){
        res.status(404);throw new Error("Something went wrong please try again");
    }else{
    res.status(200).json(randomQuestions);}
});
exports.checkAns=asyncHandler(async(req,res)=>{
    //get these information 
    const {language,difficulty,answers}=req.body;

    //than loop over answers array and one by one check the send ans is correct or not if yes than increase the score
    let scorre=0;
    for(let i=0;i<answers.length;i++){
        //id of the question using it to find the question in DB
        const id=answers[i].id
        const val=await qDB.findById(id);
        if(val.ans==answers[i].ans){
            scorre+=parseInt(difficulty);
        }
    }console.log(scorre);
    //get user id how send these answers and update or insert the score in score array in DB
    const id=req.user.id;
    const user=await userDB.findById(id);
    const index=user.score.findIndex(item=>item.language==language&&item.difficulty==difficulty);
    //If he already given this difficulty test previously
    console.log(index);
    if(index!=-1){
        const idd=user.score[index]._id;
        const ok=await userDB.updateOne({_id:id,'score._id':idd},{
            $set:{
                language,difficulty,"marks":scorre
            }
        })
        if(!ok){
            res.status(404);throw new Error("Something went wrong please try again");
        }else{
            res.status(200).json({"score":scorre}); 
        }
    }//If its first time
    else{
        const ok=await userDB.updateOne({_id:id},{
            $push:{
                score:{language,difficulty,"marks":scorre}
        }})
        if(!ok){
            res.status(404);throw new Error("Something went wrong please try again");
        }else{
            res.status(200).json({"score":scorre});   
        }
    }
});