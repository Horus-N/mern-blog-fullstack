const Post = require("../models/post.model");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");

const create = async (req, res, next) => {
  console.log(req.user);
  const user = await User.findOne({ _id: req.user.id });
  console.log(user);

  if (!user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savePost = await newPost.save();
    const newPostDoc = savePost._doc;
    res.status(201).json({ ...newPostDoc, success: true });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirecion = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).sort({updatedAt:sortDirecion}).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
        createdAt:{$gte:oneMonthAgo},
    })

    res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
        success:true
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async(req,res,next)=>{
  const userAdmin = await User.findOne({_id:req.user.id});
 if(!userAdmin.isAdmin||req.user.id!== req.userId){
  return next(errorHandler(403,'You are not allowed to delete this post'));
 }
 try {
  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json({
    'success':true,
    'message':'The post has been deleted'
    });
 } catch (error) {
  next(error)
 }
}

const updatePost = async(req,res,next)=>{
  const userAdmin = await User.findOne({_id:req.user.id});
  if(!userAdmin.isAdmin||req.user.id!== req.userId){
   return next(errorHandler(403,'You are not allowed to update this post'));
  }
  try {
    let slug = null;
    if(req.body.title){
       slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-");
    }
   const updatedPost= await Post.findByIdAndUpdate(req.params.postId,{
    $set:{
      title:req.body.title,
      content:req.body.content,
      category:req.body.category,
      image:req.body.image,
      slug
    }
   },{
    new:true
   });
   res.status(200).json({
     'success':true,
     updatedPost
     });
  } catch (error) {
   next(error)
  }
}

module.exports = { create, getPosts,deletePost,updatePost };
