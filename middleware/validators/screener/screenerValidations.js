const { body, validationResult } = require('express-validator');

const screenerValidationRules = () => {
    return [
        body('firstName')
            .trim().escape()
            .notEmpty().withMessage('First name is required'),
        body('lastName')
            .trim().escape()
            .notEmpty().withMessage('Last name is required'),
        body('sex')
            .trim().escape()
            .notEmpty().withMessage('Sex is required'),
        body('mobile')
            .trim().escape()
            .notEmpty().withMessage('Mobile number is required')
            .matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
        body('mobile2')
            .trim().escape()
            .optional()
            .matches(/^\d{10}$/).withMessage('Mobile2 number must be 10 digits'),
        body('age')
            .trim().escape()
            .notEmpty().withMessage('Age is required'),
        body('email')
            .trim().escape()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email address'),
        body('ngoId')
            .trim().escape()
            .notEmpty().withMessage('ngoId is required'),
        body('parentId')
            .trim().escape()
            .notEmpty().withMessage('parentId is required'),
        body('dateOfBirth')
            .trim().escape()
            .notEmpty().withMessage('Date of Birth is required')
            .isISO8601().withMessage('Invalid date of birth'),
        body('dateOfOnBoarding')
            .trim().escape()
            .notEmpty().withMessage('Date of Onboarding is required')
            .isISO8601().withMessage('Invalid date of onboarding'),
        body('qualification')
            .trim().escape()
            .notEmpty().withMessage('Qualification is required'),
        body('specialisation')
            .trim().escape()
            .notEmpty().withMessage('Specialisation is required'),
        body('country')
            .trim().escape()
            .notEmpty().withMessage('Country is required'),
        body('state')
            .trim().escape()
            .notEmpty().withMessage('State is required'),
        body('district')
            .trim().escape()
            .notEmpty().withMessage('District is required'),
        body('address')
            .trim().escape()
            .notEmpty().withMessage('Address is required'),
        body('pincode')
            .trim().escape()
            .optional()
            .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
        body('rating')
            .trim().escape()
            .notEmpty().withMessage('Rating is required')
            .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
    ];
};
const updateScreenerValidationRules = () => {
    return [
        body('screenerId')
            .trim().escape()
            .notEmpty().withMessage('Screener ID is required'),
        body('firstName')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('First name is required'),
        body('lastName')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Last name is required'),
        body('sex')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Sex is required'),
        body('mobile')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Mobile number is required')
            .matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
        body('mobile2')
            .optional()
            .trim().escape()
            .matches(/^\d{10}$/).withMessage('Mobile2 number must be 10 digits'),
        body('age')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Age is required'),
        body('email')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email address'),
        body('ngoId')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('ngoId is required'),
        body('parentId')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('parentId is required'),
        body('dateOfBirth')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Date of Birth is required')
            .isISO8601().withMessage('Invalid date of birth'),
        body('dateOfOnBoarding')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Date of Onboarding is required')
            .isISO8601().withMessage('Invalid date of onboarding'),
        body('qualification')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Qualification is required'),
        body('specialisation')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Specialisation is required'),
        body('country')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Country is required'),
        body('state')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('State is required'),
        body('district')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('District is required'),
        body('address')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Address is required'),
        body('pincode')
            .optional()
            .trim().escape()
            .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
        body('rating')
            .optional()
            .trim().escape()
            .notEmpty().withMessage('Rating is required')
            .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
    ];
};

const checkScreenerIdValidation = () => {
    return [
        body('screenerId')
            .notEmpty().withMessage('Please provide a valid  Screener ID')
            .isLength({ min: 1, max: 500 }).withMessage('Screener Id should not be empty or grater than 500 characters')
            .withMessage('Screener Id should be valid string')
            .trim().escape()
    ];
};

module.exports = {
    screenerValidationRules,
    updateScreenerValidationRules,
    checkScreenerIdValidation
};
