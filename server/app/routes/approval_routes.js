var express = require("express");
const router = express.Router();
var { approval_controller } = require("../controllers/v1");

router.route("/attributes").get(approval_controller.getAttributes);
router.route("/approvePendingAttributes").put(approval_controller.approvePendingAttributes);
router.route("/rejectPendingAttributes").put(approval_controller.rejectPendingAttributes);

router.route("/pendingListOfValues").get(approval_controller.getPendingListOfValues);
router.route("/approvePendingListOfValues").put(approval_controller.approvePendingListOfValues);
router.route("/rejectPendingListOfvalues").put(approval_controller.rejectPendingListOfValues);

router.route("/pendingOwnFlags").get(approval_controller.getPendingOwnFlags);
router.route("/approvePendingOwnFlags").put(approval_controller.approvePendingOwnFlags);
router.route("/rejectPendingOwnFlags").put(approval_controller.rejectPendingOwnFlags);

router.route("/pendingXrefGroupings").get(approval_controller.getPendingXrefGroupings);
router.route("/approvePendingXrefGroupings").put(approval_controller.approvePendingXrefGroupings);
router.route("/rejectPendingXrefGroupings").put(approval_controller.rejectPendingXrefGroupings);

router.route("/pendingContacts").get(approval_controller.getPendingContacts);
router.route("/approvePendingContacts").put(approval_controller.approvePendingContacts);
router.route("/rejectPendingContacts").put(approval_controller.rejectPendingContacts);

module.exports = router;