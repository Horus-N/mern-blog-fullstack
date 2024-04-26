const { errorHandler } = require("../utils/error.js");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User= require('../models/user.model')


const updateUser = async (req, res, next) => {
  if (req.user.id !== req.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
        return next(errorHandler(400,'Password must be at least 6 characters'));
    }
   req.body.password=bcryptjs.hashSync(req.body.password,10);
  }
  if(req.body.email){
        const user = await User.findOne({email:req.body.email});
        if(user){
                return res.status(401).json({
                        message:'Email already exists !'
                })
        }
  }

  if(req.body.username){
        const respon= (resStatus,message)=>{
               return res.status(resStatus).json({
                message
                })
        }
       
        if(req.body.username.length<7||req.body.username.length>20){
                // return res.status(401).json({mes:'Username must be between 7 and 20 characters'})
                return respon(401,'Username must be between 7 and 20 characters');
        }
        if(req.body.username.includes(' ')){
                return respon(401,'Username cannot contain spaces');
        }
        if(req.body.username !==req.body.username.toLowerCase()){
                return respon(401,'Username must be lowercase');
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
                return respon(401,"Username can only contain letters and numbers");
        }
        try {           
                // console.log(req.userId);
                const updateUser= await User.findByIdAndUpdate(req.userId,{
                        $set:{
                             username:req.body.username,
                             email:req.body.email,
                             profilePicture:req.body.profilePicture,
                             password:req.body.password,
                        }
                },{new:true});
                const token = jwt.sign({ id: updateUser._id }, process.env.JWT_SECRET,{expiresIn: '1d'});
                const refreshToken = jwt.sign({ id: updateUser._id }, process.env.JWT_SECRET,{expiresIn: '1y'});
                const {password,...user} =updateUser._doc;
                respon(200,{user,token,refreshToken});
        } catch (error) {
                next(error)
        }
  }
};

const deleteUser =async (req,res,next)=>{
        if(req.user.id !== req.userId){
                console.log('hello');
                return next (errorHandler(403,'your are not allowed to delete this user'));
        }
        try {
                const user = await User.findById(req.userId);
                if(user){
                        await User.findByIdAndDelete(req.userId);
                        return res.status(200).json({message:'User has been deleted'});
                }else{
                        return res.status(404).json({
                                success: false,
                                message: 'This user does not exist!'
                        })
                }
              
        } catch (error) {
                next(error)
        }
}

module.exports = { updateUser,deleteUser };
