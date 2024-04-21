const bcryptjs = require('bcryptjs');
const User = require('../models/user.model')

const signup = async(req,res)=>{
    const {username,email, password} = req.body;

    if(!username||!email||!password){
        return res.status(400).json({
            message:"Các trường không được để trống!"
        })
    }
    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUSer= new User({...req.body,password:hashedPassword})
  try {
    await newUSer.save();
    return res.json({message:'Đăng kí tai khoan thanh cong!'})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {signup}