const express = require('express');
const {updateUser,deleteUser,signout,getUser,getUsers,deleteUsers} = require('../controller/user.controller');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

router.get('/getusers',verifyToken,getUsers);
router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.delete('/delete-users/:userId',verifyToken,deleteUsers);
router.post('/signout/:userId',verifyToken,signout);
router.get('/getUser/:userId',getUser);

module.exports = router;
