const express = require('express');
const {create,getposts} = require('../controller/post.controller')
const {verifyToken} = require('../utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,create);
router.get('/getposts',getposts);
module.exports = router;