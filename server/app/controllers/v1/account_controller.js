var appController = {};
var _ = require('lodash');
var { accountService } = require("../../services");

appController.goldenAccount = goldenAccount;
appController.recentAccountChanges = recentAccountChanges;
appController.xrefGoldenAccounts = xrefGoldenAccounts;
appController.xrefGoldenAccountInfo = xrefGoldenAccountInfo;
appController.xrefGoldenAccountSearch = xrefGoldenAccountSearch;
appController.requestReassignXrefAccounts = requestReassignXrefAccounts;
appController.xrefAccountSites = xrefAccountSites;
appController.xrefAccountSiteInfo = xrefAccountSiteInfo;
appController.accountClassification = accountClassification;
appController.reporting = reporting;

appController.goldenAccountContacts = goldenAccountContacts;
appController.searchGoldenAccountContacts = searchGoldenAccountContacts;
appController.addNewContact = addNewContact;

appController.goldenAccountAttributesByGoldenAccountId = goldenAccountAttributesByGoldenAccountId;
appController.goldenAccountAttributeChangeHistory = goldenAccountAttributeChangeHistory;
appController.requestUpdateGoldenAccountAttribute = requestUpdateGoldenAccountAttribute;
appController.requestUpdateGoldenAccountOwnFlagValue = requestUpdateGoldenAccountOwnFlagValue;

appController.searchLogitechPartyName = searchLogitechPartyName;
appController.requestApproveForListOfValues = requestApproveForListOfValues;
appController.requestUpdateGoldenAccountContact = requestUpdateGoldenAccountContact;

module.exports = appController;

function goldenAccount(req, res) {
  var params = req.query;
  var masterEditableAttribles = ["ACCOUNT_NUMBER", "ACCOUNT_NAME", "COUNTRY", "ACCRUAL", "VALID_ZYME_ID", "VALID_ZYME_BUSINESS_NAME", "MASTER_NAME", "EXCLUDE_MATCH_FLAG", "CUST_NMBR_AT_DIST", "INDUSTRY_CODE", "LOGITECH_PARTY_NAME", "T3_MASTER_IDENTIFIER", "TRANSACTION_TYPE", "STRATEGIC_IMPORTANCE", "CHANNEL_POSITION"];
  accountService.getGoldenAccount(params).then(async data => {
    var goldenAccount = data[0];

    _.each(masterEditableAttribles, function (attr) {
      goldenAccount['CAN_EDIT_' + attr] = 1;
    })

    var externalAttributes = await accountService.getGoldenAccountExternalAttributes(params);
    _.each(externalAttributes, function (attribute) {
      goldenAccount[attribute.GOLDEN_ACCOUNT_ATTR_TYPE_NAME] = attribute.GOLDEN_ACCOUNT_ATTR_VALUE;
    });

    var pendingApprovalAttributes = await accountService.getGoldenAccountPendingApprovalAttributes(params);
    _.each(pendingApprovalAttributes, function (row) {
      if (masterEditableAttribles.indexOf(row.ATTRIBUTE) >= 0) {
        goldenAccount['CAN_EDIT_' + row.ATTRIBUTE] = 0;
      }
    });

    res.send({ status: true, message: "", goldenAccount });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function recentAccountChanges(req, res) {
  var params = req.query;
  accountService.recentAccountChanges(params).then(data => {
    res.send({ status: true, message: "", recentAccountChanges: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function xrefGoldenAccounts(req, res) {
  var params = req.query;
  accountService.xrefGoldenAccounts(params).then(data => {
    res.send({ status: true, message: "", xrefGoldenAccounts: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function xrefGoldenAccountInfo(req, res) {
  var params = req.query;
  accountService.xrefGoldenAccountInfo(params).then(data => {
    res.send({ status: true, message: "", xrefGoldenAccount: data[0] });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function xrefGoldenAccountSearch(req, res) {
  var params = req.query;
  params.page = (params.page) ? params.page : 1;
  params.limit = (params.limit) ? params.limit : 20;
  params.offset = (params.page == 1) ? 0 : (parseInt((params.page - 1) * params.limit));
  params.orderField = (params.orderField) ? params.orderField : '';
  params.orderAsc = (params.orderAsc == "DESC") ? 'DESC' : 'ASC';
  var rowsCount = await accountService.xrefGoldenAccountSearch(params, true);
  rowsCount = rowsCount[0]['ROW_COUNT'];
  var pagenation = { page: params.page, limit: params.limit, offset: params.offset, totalCount: rowsCount };

  accountService.xrefGoldenAccountSearch(params).then(data => {
    res.send({ status: true, message: "", xrefGoldenAccounts: data, pagenation });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function requestReassignXrefAccounts(req, res) {
  var params = req.body;
  params.CURRENT_USER_NAME = "SUPERADMIN";
  var xrefAccountRequests = [];

  for (var i = 0; i < params.ACCOUNT_IDS.length; i++) {
    var reAssignObj = {
      ACCOUNT_ID: params.ACCOUNT_IDS[i],
      CURRENT_GOLDEN_ACCOUNT_ID: params.CURRENT_GOLDEN_ACCOUNT_ID,
      NEW_GOLDEN_ACCOUNT_ID: params.NEW_GOLDEN_ACCOUNT_ID,
      CURRENT_USER_NAME: params.CURRENT_USER_NAME,
      SUBMITTED_COMMENT: ((params.SUBMITTED_COMMENT) ? params.SUBMITTED_COMMENT : ""),
      ENDDATE: ((params.ENDDATE) ? params.ENDDATE : '2100-12-31')
    };
    var xrefAccountPkey = await accountService.reassignXrefAccount(reAssignObj);
    xrefAccountRequests.push({ ACCOUNT_ID: reAssignObj.ACCOUNT_ID, PKEY: xrefAccountPkey });
  }
  res.send({ status: true, message: "", data: xrefAccountRequests });

}

async function xrefAccountSites(req, res) {
  var params = req.query;
  params.limit = (params.limit) ? params.limit : 1000;
  params.orderField = (params.orderField) ? params.orderField : 'ACCOUNT_SITE_USE_ID';
  params.orderAsc = (params.orderAsc == "ASC") ? 'ASC' : 'DESC';

  accountService.xrefAccountSites(params).then(data => {
    res.send({ status: true, message: "", xrefAccountSites: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function xrefAccountSiteInfo(req, res) {
  var params = req.query;
  if(!params.ACCOUNT_SITE_USE_ID){
    throw {message: "Please enter valid ACCOUNT_SITE_USE_ID"}
  }

  accountService.xrefAccountSiteInfo(params).then(data => {
    data = (data[0])?data[0]:{};
    res.send({ status: true, message: "", xrefAccountSite: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function accountClassification(req, res) {
  var params = req.query;
  accountService.accountClassification(params).then(data => {
    res.send({ status: true, message: "", accountClassification: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function reporting(req, res) {
  var params = req.query;
  accountService.getReporting(params).then(data => {
    res.send({ status: true, message: "", reporting: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function goldenAccountContacts(req, res) {
  var params = req.query;
  params.orderField = (params.orderField) ? params.orderField : 'FIRST_NAME';
  params.orderAsc = (params.orderAsc == "DESC") ? 'DESC' : 'ASC';
  accountService.goldenAccountContacts(params).then(data => {
    res.send({ status: true, message: "", accountContacts: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function searchGoldenAccountContacts(req, res) {
  var params = req.query;
  params.employeeID = (params.employeeID) ? params.employeeID : '';
  params.firstName = (params.firstName) ? params.firstName : '';
  params.lastName = (params.lastName) ? params.lastName : '';
  params.middleName = (params.middleName) ? params.middleName : '';
  params.orderField = (params.orderField) ? params.orderField : 'FIRST_NAME';
  params.orderAsc = (params.orderAsc == "DESC") ? 'DESC' : 'ASC';
  accountService.searchGoldenAccountContacts(params).then(data => {
    res.send({ status: true, message: "", accountContacts: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function addNewContact(req, res) {
  var params = req.body;
  params.CURRENT_USER_NAME = "SUPERADMIN";

  var goldenAccount = await accountService.getGoldenAccount({ goldenAccountId: params.GOLDEN_ACCOUNT_ID });
  goldenAccount = goldenAccount[0];

  var contactData = {};
  contactData.CONTACT_ID = params.CONTACT_ID ? params.CONTACT_ID : null;
  contactData.ACTION_TYPE = (contactData.CONTACT_ID === null) ? "ADD" : "ASSIGN";
  contactData.FIRST_NAME = params.FIRST_NAME;
  contactData.MIDDLE_NAME = params.MIDDLE_NAME;
  contactData.LAST_NAME = params.LAST_NAME;
  contactData.CONTACT_TYPE = params.CONTACT_TYPE;
  contactData.STATUS = params.STATUS;
  contactData.EMPLOYEE_ID = params.EMPLOYEE_ID;
  contactData.EMPLOYEE_TYPE = params.EMPLOYEE_TYPE;
  contactData.JOB_TITLE = params.JOB_TITLE;
  contactData.EMAIL_ADDRESS = params.EMAIL_ADDRESS;
  contactData.PHONE_NO = params.PHONE_NO;
  contactData.COLLECTOR_FLAG = params.COLLECTOR_FLAG ? params.COLLECTOR_FLAG : null;
  contactData.SALES_REP_FLAG = params.SALES_REP_FLAG ? params.SALES_REP_FLAG : null;
  contactData.EFF_START_DATE = params.EFF_START_DATE ? params.EFF_START_DATE : goldenAccount.EFF_START_DATE.toISOString().substring(0, 10);
  contactData.EFF_END_DATE = params.EFF_END_DATE ? params.EFF_END_DATE : goldenAccount.EFF_END_DATE.toISOString().substring(0, 10);
  contactData.ISREJECTED = (params.ISREJECTED == "0" || params.ISREJECTED == "1") ? parseInt(params.ISREJECTED) : 0;
  contactData.ISAPPROVED = (params.ISAPPROVED == "0" || params.ISAPPROVED == "1") ? parseInt(params.ISAPPROVED) : 0;
  contactData.SUBMITTED_BY = params.SUBMITTED_BY ? params.SUBMITTED_BY : null;
  contactData.SUBMITTED_COMMENT = params.SUBMITTED_COMMENT ? params.SUBMITTED_COMMENT : null;
  contactData.SOURCE_SYSTEM_REFERENCE_TYPE = params.SOURCE_SYSTEM_REFERENCE_TYPE ? params.SOURCE_SYSTEM_REFERENCE_TYPE : null;
  contactData.SOURCE_SYSTEM_REFERENCE = params.SOURCE_SYSTEM_REFERENCE ? params.SOURCE_SYSTEM_REFERENCE : null;
  contactData.SOURCE_SYSTEM_NAME = params.SOURCE_SYSTEM_NAME ? params.SOURCE_SYSTEM_NAME : null;
  contactData.MANAGER_FLAG = params.MANAGER_FLAG ? params.MANAGER_FLAG : null;
  contactData.CUSTOMER_CONTACTS_PKEY = params.CUSTOMER_CONTACTS_PKEY ? params.CUSTOMER_CONTACTS_PKEY : null;
  contactData.GOLDEN_ACCOUNT_ID = params.GOLDEN_ACCOUNT_ID;
  contactData.CURRENT_VERSION_FLAG = goldenAccount.CURRENT_VERSION_FLAG;
  contactData.LOGITECH_ACCOUNT_ID = goldenAccount.LOGITECH_ACCOUNT_ID;
  contactData.PRIMARY_MANAGER_FLAG = params.PRIMARY_MANAGER_FLAG ? params.PRIMARY_MANAGER_FLAG : null;
  contactData.CREATED_BY = params.CREATED_BY ? params.CREATED_BY : params.CURRENT_USER_NAME;

  accountService.addNewContact(contactData).then(data => {
    res.send({ status: true, message: "", newContact: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function goldenAccountAttributesByGoldenAccountId(req, res) {
  var params = req.query;
  accountService.goldenAccountAttributesByGoldenAccountId(params).then(data => {
    res.send({ status: true, message: "", data: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function goldenAccountAttributeChangeHistory(req, res) {
  var params = req.query;
  accountService.goldenAccountAttributeChangeHistory(params).then(data => {
    res.send({ status: true, message: "", data: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function requestUpdateGoldenAccountAttribute(req, res) {
  var params = req.body;
  try {
    var goldenAccount = await accountService.getGoldenAccount({ goldenAccountId: params.GOLDEN_ACCOUNT_ID });
    goldenAccount = goldenAccount[0];
    if ((params.ATTRIBUTE == "TRANSACTION_TYPE" || params.ATTRIBUTE == "STRATEGIC_IMPORTANCE" || params.ATTRIBUTE == "CHANNEL_POSITION") && (!params.STARTDATE || !params.ENDDATE)) {
      throw { message: "STARTDATE and ENDDATE are mandatory when attribute is TRANSACTION_TYPE" };
    }

    var accountData = {};
    accountData.GOLDENACCOUNTNUMBER = params.GOLDEN_ACCOUNT_ID;
    accountData.LOGITECH_PARTY_ID = params.LOGITECH_PARTY_ID ? params.LOGITECH_PARTY_ID : goldenAccount.LOGITECH_PARTY_ID;
    accountData.ATTRIBUTE = params.ATTRIBUTE;
    accountData.CURRENTVALUE = params.CURRENTVALUE;
    accountData.NEWVALUE = params.NEWVALUE;
    accountData.STARTDATE = params.STARTDATE ? params.STARTDATE : goldenAccount.EFF_START_DATE.toISOString().substring(0, 10);
    accountData.ENDDATE = params.ENDDATE ? params.ENDDATE : goldenAccount.EFF_END_DATE.toISOString().substring(0, 10);
    accountData.SUBMITTED_BY = params.SUBMITTED_BY;
    accountData.ISREJECTED = 0;
    accountData.ISAPPROVED = 0;
    accountData.SUBMITTED_COMMENT = params.SUBMITTED_COMMENT;
    accountService.requestUpdateGoldenAccountAttribute(accountData).then(data => {
      res.send({ status: true, message: "", accountNumber: data });
    }).catch(error => {
      res.status(400).send({ status: false, error: error.message });
    });
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
}

async function requestUpdateGoldenAccountOwnFlagValue(req, res) {
  var params = req.body;
  try {
    var xrefAccount = await accountService.getXrefGoldenAccountInfoByAccountId({ ACCOUNT_ID: params.ACCOUNT_ID });
    xrefAccount = (xrefAccount[0]) ? xrefAccount[0] : null;
    if (xrefAccount === null) {
      throw { message: "Please enter valid ACCOUNT_ID " }
    }
    var accountData = {};
    accountData.GOLDENACCOUNTNUMBER = params.ACCOUNT_ID;
    accountData.LOGITECH_PARTY_ID = xrefAccount.LOGITECH_PARTY_ID;
    accountData.ATTRIBUTE = 'Create_Its_Own_Flag';
    accountData.CURRENTVALUE = params.CURRENTVALUE;
    accountData.NEWVALUE = params.NEWVALUE;
    accountData.STARTDATE = params.STARTDATE ? params.STARTDATE : xrefAccount.EFF_START_DATE.toISOString().substring(0, 10);
    accountData.ENDDATE = params.ENDDATE ? params.ENDDATE : xrefAccount.EFF_END_DATE.toISOString().substring(0, 10);
    accountData.SUBMITTED_BY = params.SUBMITTED_BY;
    accountData.ISREJECTED = 0;
    accountData.ISAPPROVED = 0;
    accountData.SUBMITTED_COMMENT = params.SUBMITTED_COMMENT;
    accountService.requestUpdateGoldenAccountAttribute(accountData).then(data => {
      res.send({ status: true, message: "" });
    }).catch(error => {
      res.status(400).send({ status: false, error: error.message });
    });
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
}

function searchLogitechPartyName(req, res) {
  var params = req.query;
  accountService.searchLogitechPartyName(params).then(data => {
    res.send({ status: true, message: "", data: data });
  }).catch(error => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function requestApproveForListOfValues(req, res) {
  var params = req.body;
  try {

    var goldenAccountAttrType = await accountService.getGoldenAccountAttrTypeInfo({ GOLDEN_ACCOUNT_ATTR_TYPE_NAME: params.GOLDEN_ACCOUNT_ATTR_TYPE_NAME });
    goldenAccountAttrType = goldenAccountAttrType[0];

    if (goldenAccountAttrType) {
      var lovData = {};
      lovData.GOLDEN_ACCOUNT_ATTR_TYPE_ID = goldenAccountAttrType.GOLDEN_ACCOUNT_ATTR_TYPE_ID;
      lovData.NEWVALUE = params.NEWVALUE;
      lovData.STARTDATE = params.STARTDATE;
      lovData.ENDDATE = params.ENDDATE;
      lovData.SUBMITTED_BY = params.SUBMITTED_BY ? params.SUBMITTED_BY : "LB";
      lovData.SUBMITTED_COMMENT = params.SUBMITTED_COMMENT;
      accountService.requestApproveForListOfValues(lovData).then(data => {
        res.send({ status: true, message: "", data });
      }).catch(error => {
        res.status(400).send({ status: false, error: error.message });
      });
    } else {
      res.status(400).send({ status: false, error: "Please enter valid GOLDEN_ACCOUNT_ATTR_TYPE_NAME value" });
    }
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
}

async function requestUpdateGoldenAccountContact(req, res) {
  try {
    var contactData = req.body;
    contactData.ACTION_TYPE = (contactData.CONTACT_ID && contactData.CONTACT_ID != "") ? "ADD" : "EDIT";
    contactData.SUBMITTED_BY = contactData.SUBMITTED_BY ? contactData.SUBMITTED_BY : "LB";
    accountService.requestUpdateGoldenAccountContact(contactData).then(data => {
      res.send({ status: true, message: "", data });
    }).catch(error => {
      res.status(400).send({ status: false, error: error.message });
    });
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
}
