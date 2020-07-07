import { SEARCHFORM } from "config/api";

export const getSearchFormMetaData = () => {
  return SEARCHFORM.get("/searchFormMetaData");
};

export const getSearchResult = (req, page) => {
  return SEARCHFORM.get(`/searchForm`, {
    params: {
      accountName: req.accountName,
      accountNumber: req.accountNumber,
      logitechAccountId: req.logitechAccId,
      classificationType: req.classification
        ? req.classification.ID
        : undefined,
      classificationValue: req.selectedClassificationValues
        ? req.selectedClassificationValues.ID
        : undefined,
      zymeId: req.zymeId,
      validZymeId: req.validZymeId,
      validZymeBusinessName: req.validZymeName,
      channelGroupingParent: req.channelGroupingName,
      industryCode: req.industry ? req.industry.INDUSTRY_CODE : undefined,
      tier: req.tire ? req.tire.ID : undefined,
      strategicImportance: req.strategic ? req.strategic.ID : undefined,
      erpCountryCD: req.country ? req.country.ERP_COUNTRY_CD : undefined,
      region: req.region,
      t3MasterIdentifier: req.selectedT3
        ? req.selectedT3.T3_MASTER_IDENTIFIER
        : undefined,
      page: page,
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined
    },
  });
};

export const getCountryMeta = () => {
  return SEARCHFORM.get("/getCountriesList");
};

export const getIndustryMeta = () => {
  return SEARCHFORM.get("/getIndustryCodesList");
};

export const getStrategicMeta = () => {
  return SEARCHFORM.get("/strategicImportanceList");
};

export const getTransactionMeta = () => {
  return SEARCHFORM.get("/getTransactionTypesList");
};

export const getChannelGroupingParent = (value) => {
  return SEARCHFORM.get("/getChannelGroupingParentsList?searchText=" + value);
};

export const getAttributeMeta = (type) => {
  return SEARCHFORM.get("/attributeTypeValue?attrType=" + type);
};

