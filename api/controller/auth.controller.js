const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const { errorHandler } = require('../utils/error');

const signup = async(req,res,next)=>{
  try{
    const {username,email, password} = req.body;
    if(!username||!email||!password){
       next(errorHandler(400,"Tất cả các trường không được để trống!"))
    }
    const findOne = await User.findOne({$or:[{email},{username}]});
    if(findOne){
      return res.json({
        success: false,
        message:'username hoặc email đã tồn tại!'
      })
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUSer= new User({...req.body,password:hashedPassword})
    await newUSer.save();
    return res.json({message:'Đăng kí tai khoan thanh cong!'})
  } catch (error) {
    next(error);
  }
}

const signin = async(req,res)=>{
  const {username,password} = req.body;

  if(!username||!password){
    next(errorHandler(400,"Tất cả các trường không được để trống!"))
  }

  const findOne = await User.findOne({username});
  if(!findOne){
    return res.json({
      success:false,
      message:'Tài khoản hoặc mật khẩu không chính xác!'
    }
    )
  }else{
    const checkPassword = await bcryptjs.compare(req.body.password, findOne.password);

    if(checkPassword){
      return res.json({
        success:true,
        message:'Đăng nhập thành công!'
      })
    }else{
      return res.json({
        success:false,
        message:'Tài khoản hoặc mật khẩu không chính xác!'
      })
    }
  }
}

module.exports = {signup,signin}