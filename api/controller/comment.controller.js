const { errorHandler } = require("../utils/error");
const Comment = require("../models/comment.model");
const User = require('../models/user.model')

const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    console.log(content);
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(200).json({
      success: true,
      newComment,
    });
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: comments,
    });
  } catch (error) {
    next(error);
  }
};

const likePostComments = async (req, res, next) =>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        console.log(userIndex);
        if(userIndex===-1){
            comment.numberOfLikes +=1;
            comment.likes.push(req.user.id);
        }else{
            comment.numberOfLikes -=1;
            comment.likes.splice(userIndex,1);
        }

        await comment.save();
        res.status(200).json({
            success: true,
            message: comment,
          });
    } catch (error) {
        next(error)
    }
};

const updatePostComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404,'Comment not found'));
    }
    const user = await User.findById(req.user.id);
    if(comment.userId!== req.user.id && !user.isAdmin){
      return next(errorHandler(403,'You are not allowed to edit this comment'));
    }

    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,{
      content:req.body.content,
    },{
      new:true
    })

    res.status(200).json({
      success:true,
      updatedComment
    })
  } catch (error) {
    next (error)
  }
};

module.exports = {
  createComment,
  getPostComments,
  likePostComments,
  updatePostComments,
};
