const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

const verifyToken = (req, res, next) => {
  console.log(req.params.userId);
  console.log(req.headers.authorization);

  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(401, "You yet login!"));
      }
      req.user = user;
      req.userId = req.params.userId;
      next();
    });
  }
  else{
    return next(errorHandler(401,"please send request token up header!"))
  }
};

module.exports = { verifyToken };
