const Post = require("../models/post.model");
const User = require("../models/user.model")
const { errorHandler } = require("../utils/error")

const create = async (req,res,next)=>{
    console.log(req.user);
    const user =  await User.findOne({_id:req.user.id});
    console.log(user);

if(!user.isAdmin){
    return next(errorHandler(403,'You are not allowed to create a post'));
}
if(!req.body.title || !req.body.content){
    return next(errorHandler(400,'Please provide all required fields'));
}

const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');
const newPost = new Post({
    ...req.body,slug,userId:req.user.id
})

try {
    const savePost = await newPost.save();
    const newPostDoc = savePost._doc;
    res.status(201).json({...newPostDoc,success:true})
} catch (error) {
    next(error)
}
}

module.exports = {create}