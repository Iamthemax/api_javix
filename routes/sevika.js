const express = require("express");
const router = express.Router();
const {
  verifyToken,
} = require("../service/auth");

const{validate} = require("../middleware/validators/common");
const { createSevikaValidationRules, checkSevikaIdValidation, updateSevikaValidationRules } = require("../middleware/validators/sevika/sevikaValidator");
const { handleCreateSevika, handleGetAllSevika, handleDeleteSevika, handleUpdateSevika, handleGetSevikaById, handleGetMappedSevikaList, handleGetNotMappedSevikaList } = require("../controller/sevika");

router.post('/',verifyToken,handleGetAllSevika);
router.post("/create",verifyToken,createSevikaValidationRules(),validate,handleCreateSevika);
router.post('/deleteSevika',verifyToken,checkSevikaIdValidation(),validate,handleDeleteSevika);
router.post('/updateSevika',verifyToken,updateSevikaValidationRules(),validate,handleUpdateSevika);
router.post('/getSevikaById',verifyToken,checkSevikaIdValidation(),validate,handleGetSevikaById);
router.post('/getMappedSevikaList',verifyToken,handleGetMappedSevikaList);
router.post('/getNotMappedSevikaList',verifyToken,handleGetNotMappedSevikaList);
module.exports = router;
