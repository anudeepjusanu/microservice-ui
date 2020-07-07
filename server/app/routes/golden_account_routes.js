var express = require("express");
const router = express.Router();
var controller = require("../controllers/v1");

router.route("/tierList").get(controller.golden_account_controller.tierList);
router
  .route("/strategicImportanceList")
  .get(controller.golden_account_controller.strategicImportanceList);
router
  .route("/getCountriesList")
  .get(controller.golden_account_controller.getCountriesList);
router
  .route("/getRegionsList")
  .get(controller.golden_account_controller.getRegionsList);
router
  .route("/getClassificationTypesList")
  .get(controller.golden_account_controller.getClassificationTypesList);
router
  .route("/getClassificationValuesList")
  .get(controller.golden_account_controller.getClassificationValuesList);
router
  .route("/getChannelGroupingParentsList")
  .get(controller.golden_account_controller.getChannelGroupingParentsList);
router
  .route("/getIndustryCodesList")
  .get(controller.golden_account_controller.getIndustryCodesList);
router
  .route("/getT3MasterIdentifiersList")
  .get(controller.golden_account_controller.getT3MasterIdentifiersList);
router
  .route("/getTransactionTypesList")
  .get(controller.golden_account_controller.getTransactionTypesList);
router
  .route("/searchFormMetaData")
  .get(controller.golden_account_controller.searchFormMetaData);
router
  .route("/searchForm")
  .get(controller.golden_account_controller.searchForm);
router
  .route("/attributeTypeValue")
  .get(controller.golden_account_controller.attributeTypeList);

module.exports = router;
