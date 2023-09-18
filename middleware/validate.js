const asyncHandler=require('express-async-handler');
//middlware to check the token is  valid or not
const jwt=require('jsonwebtoken');
exports.validate=asyncHandler(async(req,res,next)=>{
    //using the cookie that we send while user login in our app
    const token=req.cookies.jwt;
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
            if(err){
                res.status(401).json({
                    message:"TokenExpired"
                });return ;
            }else{
            req.user=decoded.user;
            }next();});
});