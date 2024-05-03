const express = require('express');
const {create,getPosts,deletePost} = require('../controller/post.controller')
const {verifyToken} = require('../utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,create);
router.get('/getposts',getPosts);
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost);

module.exports = router;