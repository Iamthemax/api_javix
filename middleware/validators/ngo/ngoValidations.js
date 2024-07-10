const { body, validationResult } = require('express-validator');
const apiResponse=require('../../../helper/apiResponse');
const mobileRegex = new RegExp(process.env.MOBILE_REGEX);

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(res, 'Validation failed', errors.array());
  }
  next();
};


const createNgoValidationRules = () => {
    return [
      body('ngoId')
        .notEmpty().withMessage('Please provide valid Ngo Id')
        .isLength({ min: 1, max: 100 }).withMessage('Ngo Id must be between 3 and 100 characters')
        .trim().escape(),
      
      body('name')
        .notEmpty().withMessage('Please provide valid ngo name')
        .isLength({ min: 2, max: 100 }).withMessage('Ngo name must contain at least 2 characters and cannot exceed 100 characters')
        .trim().escape(),
      
      body('owner')
        .notEmpty().withMessage('Please provide valid owner name')
        .isLength({ min: 1, max: 100 }).withMessage('Owner name must contain at least 1 characters and cannot exceed 100 characters')
        .trim().escape(),
      
      body('mobile')
        .notEmpty().withMessage('Please provide a valid mobile number')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits')
        .matches(mobileRegex).withMessage('Mobile number is not valid')
        .trim().escape(),
      
      body('email')
        .notEmpty().withMessage('Please provide your email')
        .isEmail().withMessage('Please provide a valid email')
        .trim().escape(),
      
      body('ngoLoginId')
        .notEmpty().withMessage('Please provide NGO login ID')
        .isLength({ min: 1, max: 100 }).withMessage('NGO login ID must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('ngoRegistrationNo')
        .notEmpty().withMessage('Please provide NGO registration number')
        .isLength({ min: 1, max: 100 }).withMessage('NGO registration number must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('dateOfRegistration')
        .notEmpty().withMessage('Please provide the date of registration')
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape(),
      
      body('dateOfOnBoarding')
        .notEmpty().withMessage('Please provide the date of onboarding')
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape(),
      
      body('availabilityId')
        .notEmpty().withMessage('Please provide the availability ID')
        .isInt({ min: 0 }).withMessage('Availability ID must be a valid integer')
        .trim().escape(),
      
      body('country')
        .notEmpty().withMessage('Please provide the country')
        .isLength({ min: 1, max: 100 }).withMessage('Country name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('state')
        .notEmpty().withMessage('Please provide the state')
        .isLength({ min: 1, max: 100 }).withMessage('State name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('district')
        .notEmpty().withMessage('Please provide the district')
        .isLength({ min: 1, max: 100 }).withMessage('District name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('address')
        .notEmpty().withMessage('Please provide the address')
        .isLength({ min: 1 }).withMessage('Address must not be empty')
        .trim().escape(),
      
      body('photo')
        .notEmpty().withMessage('Please provide the photo')
        .isLength({ min: 1 }).withMessage('Photo must not be empty')
        .trim().escape(),
      
      body('isDefault')
        .notEmpty().withMessage('Please specify if this is the default entry')
        .isBoolean().withMessage('isDefault must be a boolean value')
        .trim().escape(),
      
      body('rating')
        .notEmpty().withMessage('Please provide a rating')
        .isInt({ min: 0 }).withMessage('Rating must be a valid integer')
        .trim().escape(),
      
      body('image')
        .notEmpty().withMessage('Please provide the image')
        .isLength({ min: 1 }).withMessage('Image is required')
        .trim().escape(),
      
      body('client_logo')
        .optional()
        .isString().withMessage('Client logo must be a string')
        .trim().escape(),
      
      body('is_active')
        .optional()
        .isBoolean().withMessage('is_active must be a boolean value')
        .trim().escape(),
      
      body('is_deleted')
        .optional()
        .isBoolean().withMessage('is_deleted must be a boolean value')
        .trim().escape(),
      
      body('createdAt')
        .optional()
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape()
    ];
  };
  const updateNgoValidationRules = () => {
    return [
      body('ngoId')
        .notEmpty().withMessage('Please provide valid Ngo Id')
        .isLength({ min: 1, max: 100 }).withMessage('Ngo Id must be between 3 and 100 characters')
        .trim().escape(),
      
      body('name')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('Ngo name must contain at least 2 characters and cannot exceed 100 characters')
        .trim().escape(),
      
      body('owner')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('Owner name must contain at least 1 characters and cannot exceed 100 characters')
        .trim().escape(),
      
      body('mobile')
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits')
        .matches(mobileRegex).withMessage('Mobile number is not valid')
        .trim().escape(),
      
      body('email')
        .optional()
        .isEmail().withMessage('Please provide a valid email')
        .trim().escape(),
      
      body('ngoLoginId')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('NGO login ID must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('ngoRegistrationNo')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('NGO registration number must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('dateOfRegistration')
        .optional()
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape(),
      
      body('dateOfOnBoarding')
        .optional()
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape(),
      
      body('availabilityId')
        .optional()
        .isInt({ min: 0 }).withMessage('Availability ID must be a valid integer')
        .trim().escape(),
      
      body('country')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('Country name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('state')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('State name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('district')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('District name must not be empty and cannot exceed 100 characters')
        .trim().escape(),
      
      body('address')
        .optional()
        .isLength({ min: 1 }).withMessage('Address must not be empty')
        .trim().escape(),
      
      body('photo')
        .optional()
        .isLength({ min: 1 }).withMessage('Photo must not be empty')
        .trim().escape(),
      
      body('isDefault')
        .optional()
        .isBoolean().withMessage('isDefault must be a boolean value')
        .trim().escape(),
      
      body('rating')
        .optional()
        .isInt({ min: 0 }).withMessage('Rating must be a valid integer')
        .trim().escape(),
      
      body('image')
        .optional()
        .isLength({ min: 1 }).withMessage('Image is required')
        .trim().escape(),
      
      body('client_logo')
        .optional()
        .isString().withMessage('Client logo must be a string')
        .trim().escape(),
      
      body('is_active')
        .optional()
        .isBoolean().withMessage('is_active must be a boolean value')
        .trim().escape(),
      
      body('is_deleted')
        .optional()
        .isBoolean().withMessage('is_deleted must be a boolean value')
        .trim().escape(),
      
      body('createdAt')
        .optional()
        .isISO8601().toDate().withMessage('Please provide a valid date')
        .trim().escape()
    ];
  };
  const getNgoByIdValidation = () => {
    return [
        body('id')
            .notEmpty().withMessage('Please provide a valid NGO ID')
            .isLength({ min: 24, max: 24 }).withMessage('NGO ID must be a 24-character hex string')
            .isHexadecimal().withMessage('NGO ID must be a valid hexadecimal string')
            .trim().escape()
    ];
};
  
module.exports = 
{ 
  createNgoValidationRules,
  updateNgoValidationRules,
  validate,
  getNgoByIdValidation
};