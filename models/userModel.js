const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:2
    },
    email:{
        type:String,
        required:true,
        unique:[true, 'already registered with this email']
    },
    password:{
        type:String,
        required:true
    },
  

   

})


userSchema.add({
    resetPasswordToken:{
        type:String,
        default:null
    },
    profilePic:{
        type:String,
        default:"https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
    },

    coverPic:{
           type:String,
        default:"https://wallpapers.com/images/hd/dark-grey-abstract-en1n0rbqrt7hhwtc.jpg"
    },
    bio:{
        type:String
    },
    city:{
        type:String
    },
    followers:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            }],


    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ]
    
    
})

// module.exports = mongoose.model( collectionName, structure )
module.exports = mongoose.model( 'users',userSchema )