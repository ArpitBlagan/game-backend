const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const userDB=require('../models/user');
const qDB=require('../models/questions');
exports.register=asyncHandler(async(req,res)=>{
    //to register the use 
    const {name,email,password,isAdmin}=req.body;
    //check the fields
    if(!name||!email||!password){
        res.status(400);throw new Error("All fields require");
    }
    // if the email is used before it is no valid
    const val=await userDB.findOne({email});
    if(val){
        res.status(400);throw new Error("This email is already registered");
    }
    //crypt the password for safety
    const hash=await bcrypt.hash(password,10);
    //create new use in DB
    const data=await userDB.create({name,email,password:hash,isAdmin});
    if(data){
    res.status(200).json({"message":"created"});}
    else{
        res.status(404);throw new Error("Something went wrong the fields");}
})
exports.logIn=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
    //check fields for login
    if(!email||!password){
        res.status(400);throw new Error("All fields require");
    }
    //find if there is any user in DB with the this email
    const user=await userDB.findOne({email});
    console.log("user",user);
    //if yes compare the bcrypt password
    if(user&&(await bcrypt.compare(password,user.password))){
        //generate the token
        const token= jwt.sign({
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        },process.env.ACCESS_TOKEN,{expiresIn:"30m"});
        //send it to user through cookies
        res.cookie("jwt",token,{
            //30 days in milisecond
            httpOnly:true,
            expires:new  Date(Date.now()+(30*24*60*60*1000)),
            sameSite: 'none',
            secure:true
        });
        if(user.isAdmin){
            res.cookie("admin","true");
        }
        else{res.cookie("admin","false");}
        //In id we are not making it httpOnly true because we have to access it in front end
        //using js cookie library if we use httpOnly:true it will not allow us to access it
        res.cookie("id","ok",{
            //30 days in milisecond
            
        });
        // const cookie=`token=${jwt};`
        // res.setHeader("set-cookie",[cookie]);
        res.status(200).json({
            id:user._id
        });
    }
    else{
        res.status(404);throw new Error("Invalide email and password");
    }
});
exports.logOut=asyncHandler(async(req,res)=>{
    //simply erase the token
    res.cookie("jwt","",{
        expires:new Date(0),
        httpOnly:true,
        sameSite: 'none',
        secure: true, 
    });res.cookie("admin","false");
    res.cookie("id","",{
        //30 days in milisecond
        path:"/"
    });
    console.log("remove the cookies");
    res.status(200).json({message:"done"});
});
exports.getScore=asyncHandler(async(req,res)=>{
    //simply take out the use using the id and send to user the info
    const id=req.user.id;
    const user=await userDB.findById(id);
    if(user){
        res.status(200).json(user);
    }
    else{
        res.status(401).json({message:"user not found"});
    }
});
exports.delScore=asyncHandler(async(req,res)=>{
    const id=req.user.id;
    console.log(id);
    const data=await userDB.updateOne({_id:id},{$set:{score:[]}})
    res.status(202).json({message:"done"});
})
exports.scoreBoard=asyncHandler(async(req,res)=>{
    const users=await userDB.find({});
    users.sort((a,b)=>b.total-a.total);
    res.status(200).json(users);
});
exports.uploadedQuestion=asyncHandler(async(req,res)=>{
    const user_id=req.user.id;
    const questions=await qDB.find({user_id});
    console.log(user_id)
    if(questions){
    res.status(200).json(questions);}
    else{
         res.status(400); throw new error("Something went wrong");
    }
})
exports.updateQuestion=asyncHandler(async(req,res)=>{
    const {id,language,difficulty,question,ans,options}=req.body;
    const data=await qDB.findByIdAndUpdate(id,{language,difficulty,question,ans,options});
    if(data){
        res.status(202).json({message:"updated"})
    }else{
        res.status(400); throw new Error("Something went wrong");
    }
});