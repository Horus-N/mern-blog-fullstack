const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require('cors');
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./utils/error");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO).then(() => console.log("Connected!"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post",postRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(5000, () => {
  console.log("ket noi serve thanh cong!");
});
