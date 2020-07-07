import { ACCOUNTDETAILS } from "config/api";

export const getAccountDetails = (AccountId) => {
  return ACCOUNTDETAILS.get("/goldenAccount", {
    params: {
      goldenAccountId: AccountId,
    },
  });
};

export const getRecentAccountChanges = (AccountId, req = {}) => {
  return ACCOUNTDETAILS.get("/recentAccountChanges", {
    params: {
      goldenAccountId: AccountId,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined,
    },
  });
};

export const getXrefAccountSites = (AccountId, req = {}) => {
  return ACCOUNTDETAILS.get("/xrefAccountSites", {
    params: {
      goldenAccountId: AccountId,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined,
    },
  });
};

export const getAccountContacts = (AccountId, req = {}) => {
  console.log("AccountId", AccountId);
  return ACCOUNTDETAILS.get("/goldenAccountContacts", {
    params: {
      goldenAccountId: AccountId,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined,
    },
  });
};

export const getReportingList = (AccountId) => {
  return ACCOUNTDETAILS.get("/reporting", {
    params: {
      goldenAccountId: AccountId,
    },
  });
};

export const getXrefGoldenAccount = (AccountId, req = {}) => {
  return ACCOUNTDETAILS.get("/xrefGoldenAccounts", {
    params: {
      goldenAccountId: AccountId,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined,
    },
  });
};

export const getAccountClassification = (AccountId) => {
  return ACCOUNTDETAILS.get("/accountClassification", {
    params: {
      goldenAccountId: AccountId,
    },
  });
};

export const updateAttribute = (attributeObj) => {
  return ACCOUNTDETAILS.post(
    "/requestUpdateGoldenAccountAttribute",
    attributeObj
  );
};

export const getChangeHistory = (AccountId, attributeName) => {
  return ACCOUNTDETAILS.get("/goldenAccountAttributeChangeHistory", {
    params: {
      goldenAccountId: AccountId,
      attributeName: attributeName,
    },
  });
};

export const getAttributes = (AccountId, attributeName) => {
  return ACCOUNTDETAILS.get("/goldenAccountAttributesByGoldenAccountId", {
    params: {
      goldenAccountId: AccountId,
      attributeName: attributeName,
    },
  });
};

export const getXrefGoldenAccountInfo = (accountId) => {
  return ACCOUNTDETAILS.get("/xrefGoldenAccountInfo", {
    params: {
      logitechAccountId: accountId,
    },
  });
};

export const addLovValue = (lovObj) => {
  return ACCOUNTDETAILS.post("/requestApproveForListOfValues", lovObj);
};

export const reassignService = (assignObj) => {
  return ACCOUNTDETAILS.post("/requestReassignXrefAccounts", assignObj);
};

export const searchContacts = (req) => {
  return ACCOUNTDETAILS.get("/searchGoldenAccountContacts", {
    params: {
      goldenAccountId: req.goldenAccountId,
      employeeID: req.employeeID,
      firstName: req.firstName,
      lastName: req.lastName,
      middleName: req.middleName,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined,
    },
  });
};

export const loadParentValues = (value) => {
  return ACCOUNTDETAILS.get("/searchLogitechPartyName", {
    params: {
      searchText: value,
    },
  });
};

export const saveContact = (req) => {
  return ACCOUNTDETAILS.post("/addNewContact", req);
};

export const getXrefSites = (id) => {
  return ACCOUNTDETAILS.get("/xrefAccountSiteInfo", {
    params: {
      ACCOUNT_SITE_USE_ID: id,
    },
  });
};

export const updateOwnFlag = (attributeObj) => {
  return ACCOUNTDETAILS.post(
    "/requestUpdateGoldenAccountOwnFlagValue",
    attributeObj
  );
};
