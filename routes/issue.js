const express = require('express');
const router = express.Router();
const {verifyToken} = require('../service/auth');

const { createIssueValidationRules } = require('../middleware/validators/issue/issueValidators');
const { 
    handleCreateIssue,
 } = require('../controller/issue');
const { validate } = require('../middleware/validators/common');

 router.post('/create',verifyToken,createIssueValidationRules(),validate,handleCreateIssue);
// router.post('/',verifyToken,handleGetAllNgos);
// router.post('/create',verifyToken,createNgoValidationRules(),validate,handleCreateNgo);
// router.post('/deleteNgo',verifyToken,handleDeleteNgo);
// router.post('/updateNgo',verifyToken,updateNgoValidationRules(),validate,handleUpdateNgo);
// router.post('/getNgoById',verifyToken,getNgoByIdValidation(),validate,handleGetNgoById);
module.exports = router;
