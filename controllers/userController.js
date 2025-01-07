const jwt = require('jsonwebtoken');
const userCollection = require('../models/userModel')
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
let JWT_SECRET = "JohnCarter@123";
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const createUser = async(req,res)=>{
    const {name ,email, password} = req.body;

        if(!name){
            return res.json({msg:"name is required",success:false})
        }

        if(!email){
            return res.json({msg:"email is required",success:false})
        }
        if(!password){
            return res.json({msg:"password is required",success:false})
        }


        let findUser = await userCollection.findOne({email})

        if(findUser){
            return res.json({msg:"user already registered",success:false})
        }
      

   try {
    let hashedPassword = bcrypt.hashSync(password,salt)

    let data = await userCollection.create({
        name,
        email,
        password:hashedPassword
    })

    res.json({msg:"user registered successfully", success:true})
   } catch (error) {
        res.json({msg:"error in creating user", success:false,error:error.message})
   }

    // let data = await new userCollection({
    //     name,
    //     email,
    //     password
    // })
    // await data.save()

}

const loginUser = async(req,res)=>{
    // res.send("login user function running")
    const {email , password} = req.body;

    if(!email){
        return res.json({msg:"email is required",success:false})
    }
    if(!password){
        return res.json({msg:"password is required",success:false})
    }


    let findUser = await userCollection.findOne({email}); //
    console.log(findUser)  //{_id ,email ,passowrd,name}

    if(findUser){
        let comparePassword = bcrypt.compareSync(password , findUser.password)
        if(comparePassword){


            let token = jwt.sign({_id:findUser._id,email:findUser.email}, JWT_SECRET);
            res.json({msg:"login successfull",success:true,token:token});
        }
        else{
            return res.json({msg:"wrong password",success:false})
        }
    }
    else{
        res.json({msg:"user not found please register",success:false})
    }
}

const deleteUser = async(req,res)=>{
   
       try {
        console.log(req.user)

        await userCollection.findByIdAndDelete(req.user)
        res.json({msg:"user deleted successfully",success:true})
       } catch (error) {
        res.json({msg:"error in deleting user",success:false,error:error.message})
       }

}

const updateUser = async(req,res)=>{

    const _id  = req.user
    console.log(_id)

    if(_id!==req.params._id){
    return res.json({msg:"not authorized to update this account", success:false})
    }
   
    let {name , password,profilePic,coverPic,bio,city} = req.body

  try {
    if(password){
        var hashedPassword = bcrypt.hashSync( password ,salt )
    }
    // let data = await userCollection.updateOne(  find , update )
    // let data = await userCollection.updateOne(  {name:"abc"} , {$set:{name:"bdc"}} )
    let data = await userCollection.findByIdAndUpdate(_id ,{name:name ,profilePic,coverPic,bio,city, password:hashedPassword} );
    res.json({msg:"user updated successfull", success:true})
  } catch (error) {
    res.json({msg:"error in updating user", success:false, error:error.message})
  }
}


const forgetPassword = async(req,res)=>{
    const {email} = req.body;

   try {
    let user = await userCollection.findOne({email});

    if(user){
        let resetToken = randomstring.generate(30);
        // res.send(resetToken);
        user.resetPasswordToken = resetToken;
        await user.save();
        // res.send("work is done")
        const mail = await sendEmail(email, resetToken);
        res.json({msg:"please check your email for password reset",success:true})

        // let updateUser = await userCollection.findByIdAndUpdate( user._id , {resetPasswordToken:resetToken} )
    }
    else{
        res.json({msg:"email does not exists", success:false})
    }
   } catch (error) {
        res.json({msg:"error in forget password",success:false,error:error.message})
   }

}

function sendEmail(email , resetToken){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "shubhamfarainzi@gmail.com",
          pass: "tyvd ibmm xerz daqc",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'shubhamfarainzi@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Password reset Request", // Subject line
          text: `Please click the link below to choose a new password: \n  "http://localhost:8080/api/users/resetToken/${resetToken}"`, // plain text body
        
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);
}

const resetPassword = async(req,res)=>{
    let token = req.params.token
    // res.send("hello")
    
    let user = await userCollection.findOne({resetPasswordToken:token})
    if(user){
        
        res.render('resetPassword' , {token})
    }
    else{
        res.send("token expired")
    }
}


const passwordReset = async(req,res)=>{
        let token = req.params.token;
        let newPassword = req.body.newPassword
    try {
        
        let user = await userCollection.findOne({resetPasswordToken:token})

        if(user){
            let hashedPassword = bcrypt.hashSync( newPassword, salt )
            user.password = hashedPassword;
            user.resetPasswordToken = null
            await user.save();


            res.json({msg:"password updated successfully", success:true})
        }
        else{
            res.json({msg:"token expired", success:false})
        }
    } catch (error) {
            res.json({msg:"error in password reset", success:false, error:error.message})
    }
}

const getUserDetails = async(req,res)=>{
    let userId = req.user;

    try {
        let data = await userCollection.findById(userId);
    res.json({msg:"user found successfully",success:true,data})
    } catch (error) {
        res.json({msg:"error in getting user",success:false,error:error.message})
    }
}

const getUserbyName= async(req,res)=>{
    let name = req.query.q;
    let query = new RegExp(name);

    if(req.query.q){
        let data = await userCollection.find({name:query})
        res.json(data)
    }

    else{
        res.json([])
    }
    


}

const getUserbyId = async(req,res)=>{
    let id = req.params._id
   try {
    let friend = await userCollection.findById(id).select('-password -email');
    res.json({msg:"user get successfully",success:true,friend})
   } catch (error) {
        res.json({msg:"error in getting user by id",success:false,error:error.message})
   }
}

const followUser = async(req,res)=>{
    let userId = req.user;
    let friendId = req.params._id

    let userDetail = await userCollection.findById(userId);
    let friendDetails = await userCollection.findById(friendId)

    console.log(userDetail)
if(!userDetail.followings.includes(friendId)){
    userDetail.followings.push(friendId)
    friendDetails.followers.push(userId)
    await userDetail.save()
    await friendDetails.save()
    return res.json({msg:"user followed successfully ",success:true})
}
else{
    userDetail.followings.pull(friendId)
    friendDetails.followers.pull(userId)
    await userDetail.save()
    await friendDetails.save()
    return res.json({msg:"user unfollowed successfully ",success:true})
}




}
module.exports  = {
    createUser,
    loginUser,
    deleteUser,
    updateUser,
    forgetPassword,
    resetPassword,
    passwordReset,
    getUserDetails,
    getUserbyName,
    getUserbyId,
    followUser
}