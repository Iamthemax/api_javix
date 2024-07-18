const { body, validationResult } = require('express-validator');
const apiResponse  = require('../../helper/apiResponse');
const validateId = () => {
    return [
        body('id')
            .notEmpty().withMessage('Please provide a  ID')
            .isLength({ min: 24, max: 24 }).withMessage(' ID must be a 24-character hex string')
            .isHexadecimal().withMessage('ID must be a valid hexadecimal string')
            .trim().escape()
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, 'Validation failed', errors.array());
    }
    next();
  };

const checkIdValidation = () => {
    return [
        body('id')
            .notEmpty().withMessage('Please provide a valid  ID')
            .isLength({ min: 24, max: 24 }).withMessage('ID must be a 24-character hex string')
            .isHexadecimal().withMessage('ID must be a valid hexadecimal string')
            .trim().escape()
    ];
};
module.exports = {
    validateId,
    validate,
    checkIdValidation
  };