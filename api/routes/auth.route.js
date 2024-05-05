const express = require('express');
const {signup,signin,google, refreshToken} = require('../controller/auth.controller');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.post('/refresh-token',verifyToken,refreshToken);

 module.exports = router;