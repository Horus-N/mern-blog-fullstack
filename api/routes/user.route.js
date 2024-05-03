const express = require('express');
const {updateUser,deleteUser,signout,getUsers} = require('../controller/user.controller');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout/:userId',verifyToken,signout);
router.get('/getusers',verifyToken,getUsers);
module.exports = router;
