const jwt = require("jsonwebtoken");
require("dotenv").config();
const apiResponse = require('../helper/apiResponse');
const User =require('../model/user')
const Tokens =require('../model/tokens')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

async function setUser(user) {
  try {
    // Options object
    const options = {};
    // If JWT_EXPIRES is defined, add expiresIn to options
    if (JWT_EXPIRES) {
      options.expiresIn = JWT_EXPIRES;
    }
    const payload = { _id: user._id, email: user.email };
    return jwt.sign(payload, JWT_SECRET_KEY, options);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if(!token)
    {
      return apiResponse.unauthorizedResponse(res, 'Access denied. No token provided.');
    }
     token = token.split(' ')[1];
    if (!token) {
        return apiResponse.unauthorizedResponse(res, 'Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);          // Check if token exists in the database
       const tokenDoc = await Tokens.findOne({ token });
    if (!tokenDoc) {
      return apiResponse.unauthorizedResponse(res, 'Invalid or expired token.');
    }
    let userAgent= await User.findOne({_id:decoded._id})
        req.user = userAgent;  // Attach user info to request object
        next();
    } catch (error) {
        console.log(error);
        return apiResponse.unauthorizedResponse(res, 'Invalid or expired token.');
    }
}

async function checkUserExists(req,res,next)
{
  let token = req.headers['authorization'];
    if(!token)
    {
      return apiResponse.unauthorizedResponse(res, 'Access denied. No token provided.');
    }
     token = token.split(' ')[1];
    if (!token) {
        return apiResponse.unauthorizedResponse(res, 'Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        const userExists = await User.findOne({ is_active: 1, is_deleted: 0,_id:decoded._id });
        if(userExists){
          req.user=userExists;
          next();
        }else{
          return apiResponse.unauthorizedResponse(res, 'User not found');
        }                              
    } catch (error) {
        console.log(error);
        return apiResponse.unauthorizedResponse(res, 'Invalid or expired token.');
    }
}
async function checkUserExistsWithotToken(req,res,next)
{
    try {
        const userExists = await User.findOne({ email:req.body.email});
        if(userExists){
          if(userExists.is_active==false || userExists.is_deleted==true)
          {
            return apiResponse.unauthorizedResponse(res, 'User is not active or deleted');
          }            
          req.user=userExists;
          next();
        }else{
          return apiResponse.unauthorizedResponse(res, 'User not found');
        }                              
    } catch (error) {
        console.log(error);
        return apiResponse.unauthorizedResponse(res, 'Error occured which checking user.');
    }
}






module.exports = {
  setUser,
  verifyToken,
  checkUserExists,
  checkUserExistsWithotToken,
};
