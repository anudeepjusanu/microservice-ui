var appController = {};
var _ = require('lodash');
var { approvalService, snowflakeCoreService } = require("../../services");
const { result } = require('lodash');

appController.getAttributes = getAttributes;
appController.approvePendingAttributes = approvePendingAttributes;
appController.rejectPendingAttributes = rejectPendingAttributes;

appController.getPendingListOfValues = getPendingListOfValues;
appController.approvePendingListOfValues = approvePendingListOfValues;
appController.rejectPendingListOfValues = rejectPendingListOfValues;

appController.getPendingOwnFlags = getPendingOwnFlags;
appController.approvePendingOwnFlags = approvePendingOwnFlags;
appController.rejectPendingOwnFlags = rejectPendingOwnFlags;

appController.getPendingXrefGroupings = getPendingXrefGroupings;
appController.approvePendingXrefGroupings = approvePendingXrefGroupings;
appController.rejectPendingXrefGroupings = rejectPendingXrefGroupings;

appController.getPendingContacts = getPendingContacts;
appController.approvePendingContacts = approvePendingContacts;
appController.rejectPendingContacts = rejectPendingContacts;

module.exports = appController;

async function getAttributes(req, res) {
    var params = req.query;
    params.page = (params.page) ? params.page : 1;
    params.limit = (params.limit) ? params.limit : 20;
    params.offset = (params.page == 1) ? 0 : (parseInt((params.page - 1) * params.limit));
    var rowsCount = await approvalService.getAttributes(params, true);
    rowsCount = rowsCount[0]['ROW_COUNT'];
    var pagenation = { page: params.page, limit: params.limit, offset: params.offset, totalCount: rowsCount };

    approvalService.getAttributes(params).then(data => {
        res.send({ status: true, message: "", data, pagenation });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

function approvePendingAttributes(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";
    var approvePendings = [];

    if (params.PKEYS && Array.isArray(params.PKEYS)) {
        _.each(params.PKEYS, function (PKEY) {
            approvePendings.push(new Promise(async (resolve, reject) => {
                var approveObj = {
                    PENDINGAPPROVALATTRIBUTE_PKEY: PKEY,
                    CURRENT_USER_NAME: params.CURRENT_USER_NAME,
                    APPROVED_COMMENT: params.APPROVED_COMMENT
                };
                approvalService.approvePendingAttribute(approveObj).then(result => {
                    if (result.pendingAttribute) {
                        resolve({ success: true, PKEY: PKEY });
                    } else {
                        reject({ success: false, PKEY, message: "Invalid PKEY", data: result });
                    }
                }).catch(error => {
                    reject({ success: false, PKEY, message: error.message });
                });
            }));
        });

        Promise.all(approvePendings).then(data => {
            res.send({ status: true, message: "", data });
        }).catch(error => {
            res.status(400).send({ status: false, error: error.message, data: error.data });
        });
    } else {
        res.status(400).send({ status: false, error: "Please enter valid PKEYS format" });
    }
}

async function rejectPendingAttributes(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";

    if (params.PKEYS && Array.isArray(params.PKEYS)) {
        params.PKEY_STRING = "'" + params.PKEYS.join("', '") + "'";
        approvalService.rejectPendingAttributes(params).then(data => {
            res.send({ status: true, message: "", data });
        }).catch(error => {
            res.status(400).send({ status: false, error: error.message });
        });
    } else {
        res.status(400).send({ status: false, error: "Please enter valid PKEYS format" });
    }
}

async function getPendingListOfValues(req, res) {
    var params = req.query;
    var pagenation = await approvalService.getPendigListOfValues(params, true);

    approvalService.getPendigListOfValues(params).then(data => {
        res.send({ status: true, message: "", data, pagenation });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

function approvePendingListOfValues(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";

    var approvePendings = [];

    _.each(params.PKEYS, function (PKEY) {
        approvePendings.push(new Promise(async (resolve, reject) => {
            var approveListOfValueObj = {
                PENDINGAPPROVALFORLOV_PKEY: PKEY,
                CURRENT_USER_NAME: params.CURRENT_USER_NAME,
                APPROVED_COMMENT: params.APPROVED_COMMENT
            };
            approvalService.approvePendingListOfValue(approveListOfValueObj).then(inserData => {

                approvalService.approvePendingListOfValueStatus(approveListOfValueObj).then(updateData => {
                    resolve({ success: true, PKEY });
                }).catch(error => {
                    reject({ success: false, PKEY, error: error.message });
                });
            }).catch(error => {
                reject({ success: false, PKEY, error: error.message });
            });

        }));
    });

    Promise.all(approvePendings).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });

}

function rejectPendingListOfValues(req, res) {
    var params = req.body;
    approvalService.rejectPendingListOfValues(params).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

/** Own Flags */
async function getPendingOwnFlags(req, res) {
    var params = req.query;
    var pagenation = await approvalService.getPendingOwnFlags(params, true);

    approvalService.getPendingOwnFlags(params).then(data => {
        res.send({ status: true, message: "", data, pagenation });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

function approvePendingOwnFlags(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";
    var approvePendings = [];

    if (params.PKEYS && Array.isArray(params.PKEYS)) {
        _.each(params.PKEYS, function (PKEY) {
            approvePendings.push(new Promise(async (resolve, reject) => {
                var approveObj = {
                    PENDINGAPPROVALATTRIBUTE_PKEY: PKEY,
                    CURRENT_USER_NAME: params.CURRENT_USER_NAME,
                    APPROVED_COMMENT: params.APPROVED_COMMENT
                };
                approvalService.approvePendingOwnFlag(approveObj).then(result => {
                    if (result.pendingAttribute) {
                        resolve({ success: true, PKEY: PKEY });
                    } else {
                        reject({ success: false, PKEY, message: "Invalid PKEY", data: result });
                    }
                }).catch(error => {
                    reject({ success: false, PKEY, message: error.message });
                });
            }));
        });

        Promise.all(approvePendings).then(data => {
            res.send({ status: true, message: "", data });
        }).catch(error => {
            res.status(400).send({ status: false, error: error.message, data: error.data });
        });
    } else {
        res.status(400).send({ status: false, error: "Please enter valid PKEYS format" });
    }
}

function rejectPendingOwnFlags(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";

    approvalService.rejectPendingOwnFlags(params).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

/** Xref Grouping */
async function getPendingXrefGroupings(req, res) {
    var params = req.query;
    var pagenation = await approvalService.getPendingXrefGroupings(params, true);

    approvalService.getPendingXrefGroupings(params).then(data => {
        res.send({ status: true, message: "", data, pagenation });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

function approvePendingXrefGroupings(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";
    var approvePendings = [];

    _.each(params.PKEYS, function (PKEY) {
        approvePendings.push(new Promise(async (resolve, reject) => {
            var approveObj = {
                PENDINGAPPROVALXREFACCT_PKEY: PKEY,
                CURRENT_USER_NAME: params.CURRENT_USER_NAME,
                APPROVED_COMMENT: params.APPROVED_COMMENT
            };
            approvalService.approvePendingXrefGrouping(approveObj).then(result => {
                if (result.pendingXref) {
                    resolve({ success: true, PKEY: PKEY });
                } else {
                    reject({ success: false, PKEY, message: "Invalid PKEY or CONTENT_ID" });
                }
            }).catch(error => {
                reject({ success: false, PKEY, error: error.message });
            });
        }));
    });

    Promise.all(approvePendings).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });

}

function rejectPendingXrefGroupings(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";

    approvalService.rejectPendingXrefGroupings(params).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

/** Contacts */
async function getPendingContacts(req, res) {
    var params = req.query;
    var pagenation = await approvalService.getPendingContacts(params, true);

    approvalService.getPendingContacts(params).then(data => {
        res.send({ status: true, message: "", data, pagenation });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });
}

function approvePendingContacts(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";
    var approvePendings = [];

    _.each(params.PKEYS, function (PKEY) {
        var approveObj = {
            PENDAPP_CUSTOMER_CONTACTS_PKEY: PKEY,
            CURRENT_USER_NAME: params.CURRENT_USER_NAME,
            APPROVED_COMMENT: params.APPROVED_COMMENT
        };
        approvePendings.push(new Promise(async (resolve, reject) => {
            approvalService.approvePendingContact(approveObj).then(inserData => {
                if (inserData.pendingContact) {
                    resolve({ success: true, PKEY: PKEY });
                } else {
                    reject({ success: false, PKEY, message: "Invalid PKEY or CONTENT_ID" });
                }
            }).catch(error => {
                reject({ success: false, PKEY, error: error.message });
            });
        }));
    });

    Promise.all(approvePendings).then(data => {
        res.send({ status: true, message: "", data });
    }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
    });

}

function rejectPendingContacts(req, res) {
    var params = req.body;
    params.CURRENT_USER_NAME = "SUPERADMIN";
    params.APPROVED_COMMENT = (params.APPROVED_COMMENT) ? params.APPROVED_COMMENT : "";

    if (params.PKEYS && Array.isArray(params.PKEYS)) {
        params.PKEY_STRING = "'" + params.PKEYS.join("', '") + "'";
        approvalService.rejectPendingContacts(params).then(data => {
            res.send({ status: true, message: "", data });
        }).catch(error => {
            res.status(400).send({ status: false, error: error.message });
        });
    } else {
        res.status(400).send({ status: false, error: "Please enter valid PKEYS format" });
    }
}
