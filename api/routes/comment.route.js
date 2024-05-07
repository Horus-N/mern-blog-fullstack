const express = require('express');
const route= express.Router();
const {verifyToken} = require('../utils/verifyUser');
const {createComment,getPostComments} =require('../controller/comment.controller')

route.post('/create',verifyToken,createComment);
route.get('/getPostComments/:postId',getPostComments);

module.exports= route