const express = require('express');
const {create} = require('../controller/post.controller')
const {verifyToken} = require('../utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,create);
module.exports = router;