var express = require("express");
const router = express.Router();
var { account_controller } = require("../controllers/v1");

router.route("/goldenAccount").get(account_controller.goldenAccount);
router.route("/recentAccountChanges").get(account_controller.recentAccountChanges);
router.route("/xrefGoldenAccounts").get(account_controller.xrefGoldenAccounts);
router.route("/xrefGoldenAccountInfo").get(account_controller.xrefGoldenAccountInfo);
router.route("/xrefGoldenAccountSearch").get(account_controller.xrefGoldenAccountSearch);
router.route("/requestReassignXrefAccounts").post(account_controller.requestReassignXrefAccounts);
router.route("/xrefAccountSites").get(account_controller.xrefAccountSites);
router.route("/xrefAccountSiteInfo").get(account_controller.xrefAccountSiteInfo);
router.route("/accountClassification").get(account_controller.accountClassification);
router.route("/reporting").get(account_controller.reporting);

router.route("/goldenAccountContacts").get(account_controller.goldenAccountContacts);
router.route("/searchGoldenAccountContacts").get(account_controller.searchGoldenAccountContacts);
router.route("/addNewContact").post(account_controller.addNewContact);

router.route("/goldenAccountAttributesByGoldenAccountId").get(account_controller.goldenAccountAttributesByGoldenAccountId);
router.route("/goldenAccountAttributeChangeHistory").get(account_controller.goldenAccountAttributeChangeHistory);
router.route("/requestUpdateGoldenAccountAttribute").post(account_controller.requestUpdateGoldenAccountAttribute);
router.route("/requestUpdateGoldenAccountOwnFlagValue").post(account_controller.requestUpdateGoldenAccountOwnFlagValue);
router.route("/requestApproveForListOfValues").post(account_controller.requestApproveForListOfValues);

router.route("/searchLogitechPartyName").get(account_controller.searchLogitechPartyName);
router.route("/requestUpdateGoldenAccountContact").post(account_controller.requestUpdateGoldenAccountContact);

module.exports = router;