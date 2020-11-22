const User = require("../Modals/UserModal");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../Utils/database");

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashed_password = await Bcrypt.hash(password, 10);
    const user = new User(name, email, hashed_password);
    const result = await user.save();
    res.status(201).json({ message: "User Created!", user: result });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (user) {
    Bcrypt.compare(password, user.password, (err, same) => {
      if (err) {
        throw err;
      }
      if (same) {
        var token = jwt.sign(
          {
            userId: user._id,
            name: user.name,
            email: user.email,
          },
          "this is very secret string",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          userId: user._id,
          username: user.name,
          token,
          expiresIn: new Date().getTime() + 60 * 60 * 1000,
        });
      } else {
        res.status(402).json({
          message: "Password not valid!",
        });
      }
    });
  } else
    res.status(402).json({ message: "Please enter correct Email address!" });
};

module.exports.getAllPost = async (req, res, next) => {
  const { userId } = req.body;
  if (userId !== req.userId) {
    throw new Error("Not Authenticated!");
  }
  const db = getDB();
  try {
    const result = await db.collection("post").find().toArray();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
