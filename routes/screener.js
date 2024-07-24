const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUserExists,
} = require("../service/auth");



const {
  screenerValidationRules,
  updateScreenerValidationRules,
  checkScreenerIdValidation,
} = require("../middleware/validators/screener/screenerValidations");
const{checkIdValidation,validate} = require("../middleware/validators/common");
const { handleCreateScreener,handleGetAllScreener, handleDeleteScreener, handleUpdateScreener, handleGetScreenerById, handleGetMappedScreenersList, handleGetNotMappedScreenersList } = require("../controller/screener");

router.post('/',verifyToken,handleGetAllScreener);
router.post("/create",verifyToken,screenerValidationRules(),validate,checkUserExists,handleCreateScreener);
router.post('/deleteScreener',verifyToken,checkScreenerIdValidation(),validate,handleDeleteScreener);
router.post('/updateScreener',verifyToken,updateScreenerValidationRules(),validate,handleUpdateScreener);
router.post('/getScreenerById',verifyToken,checkScreenerIdValidation(),validate,handleGetScreenerById);
router.post('/getMappedScreenersList',verifyToken,handleGetMappedScreenersList);
router.post('/getNotMappedScreenersList',verifyToken,handleGetNotMappedScreenersList);
module.exports = router;
