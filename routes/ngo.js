const express = require('express');
const router = express.Router();
const {verifyToken,checkUserExists,checkUserExistsWithotToken} = require('../service/auth');

const {
    createNgoValidationRules,
    updateNgoValidationRules,
    validate,
  } = require('../middleware/validators/ngo/ngoValidations');
const { 
    handleCreateNgo,
    handleGetAllNgos,
    handleDeleteNgo,
    handleUpdateNgo,
 } = require('../controller/ngo');

router.post('/',verifyToken,handleGetAllNgos);
router.post('/create',verifyToken,createNgoValidationRules(),validate,handleCreateNgo);
router.post('/deleteNgo',verifyToken,handleDeleteNgo);
router.post('/updateNgo',verifyToken,updateNgoValidationRules(),validate,handleUpdateNgo);
module.exports = router;
