const { body, validationResult } = require('express-validator');
const validateId = () => {
    return [
        body('id')
            .notEmpty().withMessage('Please provide a  ID')
            .isLength({ min: 24, max: 24 }).withMessage(' ID must be a 24-character hex string')
            .isHexadecimal().withMessage('ID must be a valid hexadecimal string')
            .trim().escape()
    ];
};


module.exports = {
    validateId
  };