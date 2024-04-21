const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO).then(() => console.log("Connected!"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(5000, () => {
  console.log("ket noi serve thanh cong!");
});
