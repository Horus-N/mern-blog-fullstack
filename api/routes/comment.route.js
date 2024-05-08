const express = require("express");
const route = express.Router();
const { verifyToken } = require("../utils/verifyUser");
const {
  createComment,
  getPostComments,
  updatePostComments,
  deletePostComment,
  likePostComments,
} = require("../controller/comment.controller");

route.post("/create", verifyToken, createComment);
route.get("/getPostComments/:postId", getPostComments);
route.put("/likeComment/:commentId", verifyToken, likePostComments);
route.put("/updateComment/:commentId", verifyToken, updatePostComments);
route.delete("/deleteComment/:commentId", verifyToken, deletePostComment);
module.exports = route;
