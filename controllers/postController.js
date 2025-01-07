let PostCollection = require('../models/Postmodel')

const createPost = async (req, res) => {
    // res.send("create function is running")

    let { title, description, file } = req.body;
    let _id = req.user;
    try {

        let data = await PostCollection.create({
            title,
            description,
            file,
            userId: _id
        })
        res.json({ msg: "post created successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in creating post", success: false, error: error.message })
    }

}

const updatePost = async (req, res) => {
    res.send("update function is running")
}

const deletePost = async (req, res) => {
    res.send("delete function is running")
}

const getAllPost = async (req, res) => {
    // res.send("get all function is running")
    try {
        let posts = await PostCollection.find().sort({ createdAt: -1 }).populate({ path: "userId", select: 'name profilePic' }).populate({ path: 'comments', populate: { path: 'user', select: 'name profilePic' } });
        res.json({ msg: "all data fetched successfully", success: true, posts })
    } catch (error) {
        res.json({ msg: "error in getting all posts", success: false, error: error.message })
    }
}

const getYourPost = async (req, res) => {
    try {
        let userId = req.user;
        let post = await PostCollection.find({ userId: userId }).populate('userId');
        res.json({ msg: "post get successfully", success: true, post })
    } catch (error) {
        res.json({ msg: "error in getting user post ", success: false, error: error.message })
    }
}

const getfriendPost = async (req, res) => {
    let id = req.params._id;
    try {
        let posts = await PostCollection.find({ userId: id })
        res.json({ msg: "post get successfully", success: true, posts })
    } catch (error) {
        res.json({ msg: "error in getting posts", success: false, error: error.message })
    }
}

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user;
        const postId = req.params.postId;

        let post = await PostCollection.findById(postId)
        post.comments.push({ user: userId, text })
        await post.save();
        res.json({ msg: "post commented successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in comment post", success: false, error: error.message })
    }
}

const deleteComment = async (req, res) => {
    let { commentId, postId } = req.params;
    try {
        let post = await PostCollection.findById(postId);

        let filetredArr = post.comments.filter((ele)=>ele._id.toString()!==commentId)
        console.log(filetredArr)
        post.comments = filetredArr
        await post.save();

        res.json({ msg: "comment deleted successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in deleting post", success: false, error: error.message })
    }
}

const likeorDislike = async(req,res)=>{
    const postId = req.params.postId;
    const userId = req.user;

  try {
    let post = await PostCollection.findById(postId)
    if(!post.likes.includes(userId)){
        post.likes.push(userId)
        await post.save()
        res.json({msg:"post liked successfully",success:true})
    }
    else{
        post.likes.pull(userId)
        await post.save()
        res.json({msg:"post disliked successfully",success:true})
    }
  } catch (error) {
    res.json({msg:"error in like post", success:false,error:error.message})
  }
   

}
module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPost,
    getYourPost,
    getfriendPost,
    commentPost,
    deleteComment,
    likeorDislike
}