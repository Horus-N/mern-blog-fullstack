const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();

dotenv.config()
mongoose.set('strictQuery', true);


mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected!'));
app.listen(5000,()=>{
    console.log('ket noi serve thanh cong!');
})
