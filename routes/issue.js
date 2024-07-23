const express = require('express');
const router = express.Router();
const {verifyToken} = require('../service/auth');

const { createIssueValidationRules, deleteIssueValidations, updateIssueValidationRules, checkUserIdValidation } = require('../middleware/validators/issue/issueValidators');
const { 
    handleCreateIssue,
    handleDeleteIssue,
    handleGetAllIssues,
    handleGetIssueById,
    handleGetAllIssuesByUserId,
    handleUpdateIssue,
 } = require('../controller/issue');
const { validate,} = require('../middleware/validators/common');

router.post('/create',verifyToken,createIssueValidationRules(),validate,handleCreateIssue);
router.post('/updateIssue',verifyToken,updateIssueValidationRules(),validate,handleUpdateIssue);
router.post('/deleteIssue',verifyToken,deleteIssueValidations(),validate,handleDeleteIssue);
router.post('/',verifyToken,handleGetAllIssues);
router.post('/getIssueById',verifyToken,deleteIssueValidations(),validate,handleGetIssueById);
router.post('/getAllIssuesByUserId',verifyToken,checkUserIdValidation(),validate,handleGetAllIssuesByUserId);
module.exports = router;
