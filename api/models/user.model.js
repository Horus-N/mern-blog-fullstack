const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture:{
      type:String,
      default:"https://hocdohoacaptoc.com/storage/2022/02/avata-dep-nam-2.jpg",
    },
    isAdmin:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema);
module.exports=User;
