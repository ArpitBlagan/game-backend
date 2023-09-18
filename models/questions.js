const mongoose=require('mongoose');
//Question schema
const questions=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userDB'
    },
    language:{
        type:String,
        required:[true,'which language is required']
    },
    difficulty:{
        type:Number,
        range:[1-5],
        required:[true,'difficulty level is required']
    },
    question:{
        type:String,
    },
    options:[String],
    ans:{
        type:String,
        required:[true,'answer is required']
    }
});
module.exports=mongoose.model('qDB',questions);