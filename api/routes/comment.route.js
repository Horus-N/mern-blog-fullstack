const express = require("express");
const route = express.Router();
const { verifyToken } = require("../utils/verifyUser");
const {
  createComment,
  getPostComments,
  updatePostComments,
  deletePostComment,
  likePostComments,
  getcomments,
} = require("../controller/comment.controller");

route.post("/create", verifyToken, createComment);
route.get("/getPostComments/:postId", getPostComments);
route.put("/likeComment/:commentId", verifyToken, likePostComments);
route.put("/updateComment/:commentId", verifyToken, updatePostComments);
route.delete("/deleteComment/:commentId", verifyToken, deletePostComment);
route.get("/getcomments", verifyToken, getcomments);
module.exports = route;
