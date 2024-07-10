const express = require('express');
const router = express.Router();
const {verifyToken,checkUserExists,checkUserExistsWithotToken} = require('../service/auth');

const {
    createNgoValidationRules,
    updateNgoValidationRules,
    validate,
    getNgoByIdValidation
  } = require('../middleware/validators/ngo/ngoValidations');
const { 
    handleCreateNgo,
    handleGetAllNgos,
    handleDeleteNgo,
    handleUpdateNgo,
    handleGetNgoById
 } = require('../controller/ngo');

router.post('/',verifyToken,handleGetAllNgos);
router.post('/create',verifyToken,createNgoValidationRules(),validate,handleCreateNgo);
router.post('/deleteNgo',verifyToken,handleDeleteNgo);
router.post('/updateNgo',verifyToken,updateNgoValidationRules(),validate,handleUpdateNgo);
router.post('/getNgoById',verifyToken,getNgoByIdValidation(),validate,handleGetNgoById);
module.exports = router;
