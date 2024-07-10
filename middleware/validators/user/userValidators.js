const { body, validationResult } = require('express-validator');
const apiResponse=require('../../../helper/apiResponse');
const User=require('../../../model/user');
const mobileRegex = new RegExp(process.env.MOBILE_REGEX);

// Validation rules for user creation
const createUserValidationRules = () => {
  return [
    body('firstName').notEmpty().isLength({ min: 2, max: 200 }).trim().escape().withMessage('First name is required'),
    body('lastName').notEmpty().isLength({ min: 2, max: 200 }).withMessage('Last name is required'),
    body('mobile').trim().escape().isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits').matches(mobileRegex).withMessage('Mobile number is not valid'),
    body('email').trim().escape().isEmail().withMessage('Valid email is required'),
    body('password').trim().escape().isLength({ min: 8 ,max:100}).withMessage('Password must be at least 8 characters long'),
    body('roleId').trim().escape().isLength({ min: 1 ,max:10}).notEmpty().withMessage('Role ID is required')
  ];
};

const updateUserValidationRules = () => {
  return [
    body('firstName').trim().escape().optional().notEmpty().isLength({ min: 2, max: 200 }).withMessage('First name cannot be empty'),
    body('lastName').trim().escape().optional().notEmpty().isLength({ min: 2, max: 200 }).withMessage('Last name cannot be empty'),
    body('mobile').trim().escape().optional().isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
    body('is_active').trim().escape().optional().isBoolean().withMessage('is_active must be a boolean value'),
    body('is_deleted').trim().escape().optional().isBoolean().withMessage('is_deleted must be a boolean value'),
    body('roleId').trim().escape().optional().notEmpty().isLength({ min: 1 ,max:10}).withMessage('Role ID cannot be empty'),
    body('email').trim().escape().optional().isEmail().withMessage('Valid email is required')
    .custom(async (email, { req }) => {
      // Check if email already exists, but ignore the current user's email
      const user = await User.findOne({ email: email });
      if (user && user._id.toString() !== req.user._id) {
        throw new Error('Email already in use');
      }
    }),
  ];
};

// Validation rules for user login
const loginUserValidationRules = () => {
  return [
    body('email').trim().escape().isEmail().trim().withMessage('Valid email is required'),
    body('password').trim().escape().notEmpty().isLength({
        min: 8,
        max: 100,
    }).trim().withMessage('Password is required min 8 digit')
  ];
};
// Validation rules for user login
const changePasswordValidationRules = () => {
  return [
    body('old_password').trim().escape().notEmpty().isLength({
        min: 8,
        max: 100,
    }).trim().trim().escape().withMessage('Password is required min 8 digit'),
    body('new_password').trim().escape().notEmpty().isLength({
      min: 8,
      max: 100,
  }).trim().trim().escape().withMessage('Password is required min 8 digit'),
  body('new_password').custom((value, { req }) => {
    if (value === req.body.old_password) {
      throw new Error('New password should not be the same as the old password');
    }
    return true;
  }),
  ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(res, 'Validation failed', errors.array());
  }
  next();
};

module.exports = {
  createUserValidationRules,
  loginUserValidationRules,
  validate,
  changePasswordValidationRules,
  updateUserValidationRules
};
