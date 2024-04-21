const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
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
  const {email,password} = req.body;

  if(!email||!password){
    next(errorHandler(400,"Tất cả các trường không được để trống!"))
  }

  const findOne = await User.findOne({email});
  if(!findOne){
    return res.json({
      success:false,
      message:'Tài khoản hoặc mật khẩu không chính xác!'
    }
    )
  }else{
    const checkPassword = await bcryptjs.compare(req.body.password, findOne.password);

    if(checkPassword){
      const users = {...findOne._doc};
      delete users.password;
      return res.json({
        success:true,
        message:'Đăng nhập thành công!',
        user:users
      })
    }else{
      return res.json({
        success:false,
        message:'Tài khoản hoặc mật khẩu không chính xác!'
      })
    }
  }
}

const google = async (req,res)=>{
  const {email,name,googlePhotoUrl} = req.body;

  try {
    const user = await User.findOne({email});
    if(user){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
      const {password,...rest} =user._doc;
      return res.status(200).cookie('access_token',token,{
        httpOnly:true,
      }).json({
        success:true,
        ...rest
      }
      );
    }else{
      const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
      const newUser = new User({
        username:name.toLowerCase().split(" ") .join("") + Math.random().toString(9).slice(-4),
        email,
        password:hashedPassword,
        profilePicture:googlePhotoUrl
      })

      await newUser.save();
      const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
      const {password,...rest} = newUser._doc;

      return res.status(200).cookie('access_token',token,{
        httpOnly:true,
      }).jsonjson({
        success:true,
        ...rest
      }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {signup,signin,google}