const coreService = require("./snowflake_core_service");
var service = {};

service.getTierList = async () => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AS ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE as TIER
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D, PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID=GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = 'TIER'
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
    AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG='Y' ORDER BY GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE`;

  return coreService.execute(sqlText);
};

service.getStrategicImportanceList = async () => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AS ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE AS STATERGIC_IMPORTANCE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D, PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID=GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = 'STRATEGIC_IMPORTANCE'
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
    AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG='Y' ORDER BY GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE`;

  return coreService.execute(sqlText);
};

service.getCountriesList = async () => {
  var sqlText = `SELECT DISTINCT COUNTRY, ERP_COUNTRY_CD, REGION
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE COUNTRY <> '' AND ERP_COUNTRY_CD <> '' AND REGION <> '' AND CURRENT_VERSION_FLAG = 'Y'
    GROUP BY ERP_COUNTRY_CD, COUNTRY, REGION
    ORDER BY COUNTRY`;

  return coreService.execute(sqlText);
};

service.getRegionsList = async () => {
  var sqlText = `SELECT DISTINCT REGION
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE CURRENT_VERSION_FLAG = 'Y' AND REGION IS NOT NULL 
    ORDER BY REGION`;

  return coreService.execute(sqlText);
};

service.getClassificationTypesList = async () => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_TYPE_ID AS ID, GOLDEN_ACCOUNT_ATTR_TYPE_NAME AS CLASSIFICATION_TYPE 
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D 
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_NAME  
        IN ('PRICING_CLASSIFICATION','CHANNEL_CLASSIFICATION','BUSINESS_TYPE','DR_CUSTOMER_TYPE')
        AND CURRENT_VERSION_FLAG = 'Y' 
    ORDER BY GOLDEN_ACCOUNT_ATTR_TYPE_NAME`;

  return coreService.execute(sqlText);
};

service.getClassificationValuesList = async () => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AS ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE AS CLASSIFICATION_VALUE,
        GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME AS CLASSIFICATION_TYPE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D, PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID=GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
        AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME IN ('PRICING_CLASSIFICATION','CHANNEL_CLASSIFICATION','BUSINESS_TYPE','DR_CUSTOMER_TYPE')
        AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
        AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG='Y' 
    ORDER BY GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE`;

  return coreService.execute(sqlText);
};

service.getChannelGroupingParentsList = async (query) => {
  var sqlText = `SELECT DISTINCT LOGITECH_PARTY_NAME
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE CURRENT_VERSION_FLAG = 'Y' `;
  if (query.searchText) {
    sqlText += `AND LOGITECH_PARTY_NAME ILIKE ANY '%${query.searchText}%' `;
  }
  sqlText += `ORDER BY LOGITECH_PARTY_NAME `;
  if (query.searchText) {
    sqlText += `LIMIT 50 `;
  } else {
    sqlText += `LIMIT 1000 `;
  }

  return coreService.execute(sqlText);
};

service.getIndustryCodesList = async () => {
  var sqlText = `SELECT DISTINCT INDUSTRY_CODE
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE CURRENT_VERSION_FLAG = 'Y' 
        AND INDUSTRY_CODE <> '-' AND INDUSTRY_CODE <> '_-' AND INDUSTRY_CODE IS NOT NULL 
    ORDER BY INDUSTRY_CODE`;

  return coreService.execute(sqlText);
};

service.getT3MasterIdentifiersList = async () => {
  var sqlText = `SELECT DISTINCT T3_MASTER_IDENTIFIER
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE  CURRENT_VERSION_FLAG = 'Y' AND T3_MASTER_IDENTIFIER IS NOT NULL 
    ORDER BY T3_MASTER_IDENTIFIER`;

  return coreService.execute(sqlText);
};

service.getTransactionTypesList = async () => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AS ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE AS STATERGIC_IMPORTANCE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D, PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID=GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = 'TRANSACTION_TYPE'
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
    AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG='Y' ORDER BY GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE`;

  return coreService.execute(sqlText);
};

service.getAttributeTypeList = async (attrName) => {
  var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AS ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE AS ATTR_VALUE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D, PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID=GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = '${attrName}'
    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
    AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG='Y' ORDER BY GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE`;

  return coreService.execute(sqlText);
};

service.searchFormMetaData = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      service.getTierList(),
      service.getStrategicImportanceList(),
      service.getCountriesList(),
      service.getRegionsList(),
      service.getClassificationTypesList(),
      service.getClassificationValuesList(),
      service.getIndustryCodesList(),
      service.getT3MasterIdentifiersList(),
    ])
      .then((results) => {
        resolve({
          tiers: results[0],
          strategicImportances: results[1],
          countries: results[2],
          regions: results[3],
          classificationTypes: results[4],
          classificationValues: results[5],
          industryCodes: results[6],
          t3MasterIdentifiers: results[7],
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

service.getSearchForm = async (searchKeys, paging = false) => {
  if (paging === true) {
    var sqlText = `SELECT COUNT(DISTINCT(m.GOLDEN_ACCOUNT_ID)) AS ROW_COUNT FROM PRESENTATION.GOLDEN_ACCOUNT_D m`;
  } else {
    var sqlText = `SELECT DISTINCT(m.GOLDEN_ACCOUNT_ID), m.GOLDEN_ACCOUNT_NAME, m.LOGITECH_ACCOUNT_ID, m.ACCOUNT_NUMBER, m.ZYME_ID,
            m.VALID_ZYME_ID, m.COUNTRY, m.REGION, m.CUST_NMBR_AT_DIST, m.EXCLUDE_MATCH_FLAG, m.T3_MASTER_IDENTIFIER, m.INDUSTRY_CODE
        FROM PRESENTATION.GOLDEN_ACCOUNT_D m`;
  }

  if (
    searchKeys.tier ||
    searchKeys.strategicImportance ||
    searchKeys.classificationType ||
    searchKeys.classificationValue
  ) {
    sqlText += ` JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE ON m.GOLDEN_ACCOUNT_ID = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID AND GOLDEN_ACCOUNT_ATTR_BRIDGE.CURRENT_VERSION_FLAG = 'Y'`;
  }
  sqlText += ` WHERE m.CURRENT_VERSION_FLAG = 'Y'`;
  if (searchKeys.accountNumber) {
    sqlText += " AND m.ACCOUNT_NUMBER = '" + searchKeys.accountNumber + "'";
  }
  if (searchKeys.accountName) {
    sqlText +=
      " AND UPPER(m.GOLDEN_ACCOUNT_NAME) LIKE '%" +
      searchKeys.accountName.toUpperCase() +
      "%'";
  }
  if (searchKeys.logitechAccountId) {
    sqlText +=
      " AND m.LOGITECH_ACCOUNT_ID = '" + searchKeys.logitechAccountId + "'";
  }
  if (
    searchKeys.tier ||
    searchKeys.strategicImportance ||
    searchKeys.classificationType ||
    searchKeys.classificationValue
  ) {
    let conditionList = [];
    if (searchKeys.tier) {
      conditionList.push(
        "GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = '" +
          searchKeys.tier +
          "'"
      );
    }
    if (searchKeys.strategicImportance) {
      conditionList.push(
        "GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = '" +
          searchKeys.strategicImportance +
          "'"
      );
    }
    // if(searchKeys.classificationType){
    //     conditionList.push("GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = '"+searchKeys.classificationType+"'");
    // }
    if (searchKeys.classificationValue) {
      conditionList.push(
        "GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = '" +
          searchKeys.classificationValue +
          "'"
      );
    }
    sqlText += " AND (" + conditionList.join(" OR ") + ") ";
  }
  if (searchKeys.zymeId) {
    sqlText += " AND m.ZYME_ID = '" + searchKeys.zymeId + "'";
  }
  if (searchKeys.validZymeId) {
    sqlText += " AND m.VALID_ZYME_ID = '" + searchKeys.validZymeId + "'";
  }
  if (searchKeys.validZymeBusinessName) {
    sqlText +=
      " AND UPPER(m.VALID_ZYME_BUSINESS_NAME) LIKE '%" +
      searchKeys.validZymeBusinessName.toUpperCase() +
      "%'";
  }
  if (searchKeys.channelGroupingParent) {
    sqlText +=
      " AND m.GOLDEN_ACCOUNT_NAME LIKE '" +
      searchKeys.channelGroupingParent +
      "'";
  }
  if (searchKeys.industryCode) {
    sqlText += " AND m.INDUSTRY_CODE LIKE '" + searchKeys.industryCode + "'";
  }
  if (searchKeys.erpCountryCD) {
    sqlText += " AND m.ERP_COUNTRY_CD = '" + searchKeys.erpCountryCD + "'";
  }
  if (searchKeys.region) {
    sqlText += " AND m.REGION LIKE '" + searchKeys.region + "'";
  }
  if (searchKeys.t3MasterIdentifier) {
    sqlText +=
      " AND m.T3_MASTER_IDENTIFIER LIKE '" +
      searchKeys.t3MasterIdentifier +
      "'";
  }
  sqlText +=
    "ORDER BY m." + searchKeys.orderField + " " + searchKeys.orderAsc + " ";
  if (paging === false) {
    sqlText += ` LIMIT ${searchKeys.limit} OFFSET ${searchKeys.offset} `;
  }
  return coreService.execute(sqlText);
};

module.exports = service;
