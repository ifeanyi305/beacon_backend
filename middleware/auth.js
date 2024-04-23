const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({message:"Not authorized to access this route"});
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decodeToken.id);

    next();
  } catch (error) {
    returnres.status(401).json({message:"Not authorized to access this route"});
  }
};


 
module.exports = {
    protect
}