const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new Error("Not Authenticated!");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "this is very secret string");
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    throw new Error("Not Authenticated!");
  }

  req.userId = decodedToken.userId;
  next();
};
