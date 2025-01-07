
let Message = require('../models/Message')
let Conversation = require('../models/Conversation')
exports.sendMessage = async(req,res)=>{
    const {friendId} = req.params
    const userId = req.user
    const {text} = req.body;
try {
    
    let message = await Message.create({
        friendId,
        userId,
        text
    })

    let conversation = await Conversation.findOne({ members: { $all: [userId, friendId] } });
    if(!conversation){
        conversation = await Conversation.create({members:[userId,friendId]})
    }

    conversation.messages.push(message._id)
    await conversation.save()


    res.json({msg:"message sent successfully",success:true})
} catch (error) {
    res.json({msg:"error in send message",success:false,error:error.message})
}
}


exports.getChat = async(req,res)=>{
    let  userId = req.user;
    let {friendId} = req.params;

   let messages = await Conversation.findOne({ members: { $all: [userId, friendId] } }).populate('messages')
    console.log(messages)
    if(!messages){
        messages={
            messages:[]
        }
     
    }
   res.json({msg:'get successfully', success:true, chat:messages.messages})
}



