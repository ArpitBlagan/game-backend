//Global error middleware
exports.error=(err,req,res,next)=>{
    res.status(res.statusCode).json({
        message:err.message
    });
    next();
}