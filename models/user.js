const mongoose=require('mongoose');
//User schema
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    score:[{
        language:String,
        difficulty:Number,
        marks:Number
    }],
    isAdmin:{
        type:Boolean,
        default:false
    }
},{
    //for using virtual function ..
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
userSchema.virtual('total').get(function () {
    const arr=this.score;
    let total=0;
    for(let i=0;i<arr.length;i++){
        total+=parseInt(arr[i].marks||arr[i].score);
    }
    return total;
  });
module.exports=mongoose.model('userDB',userSchema);