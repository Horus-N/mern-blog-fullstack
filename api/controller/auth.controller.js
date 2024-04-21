const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const { errorHandler } = require('../utils/error');

const signup = async(req,res,next)=>{
    const {username,email, password} = req.body;

    if(!username||!email||!password){
       next(errorHandler(400,"Tất cả các trường không được để trống!"))
    }
    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUSer= new User({...req.body,password:hashedPassword})
  try {
    await newUSer.save();
    return res.json({message:'Đăng kí tai khoan thanh cong!'})
  } catch (error) {
    next(error);
  }
}

module.exports = {signup}