const coreService = require('./snowflake_core_service');
const { query } = require('express');
var service = {};

service.getGoldenAccount = async (query) => {
    var sqlText = `SELECT * FROM PRESENTATION.GOLDEN_ACCOUNT_D 
    WHERE GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}'
    AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'`;

    return coreService.execute(sqlText);
}

service.getGoldenAccountExternalAttributes = async (query) => {
    var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID, GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID, 
        GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE
    JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D ON GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG = 'Y'
    JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D ON GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y' 
    WHERE GOLDEN_ACCOUNT_ATTR_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
        AND GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}' `;

    return coreService.execute(sqlText);
}

service.getGoldenAccountPendingApprovalAttributes = async (query) => {
    var sqlText = `SELECT PENDINGAPPROVALATTRIBUTE.ATTRIBUTE FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE 
    WHERE PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER = '${query.goldenAccountId}'
    AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = '0' AND PENDINGAPPROVALATTRIBUTE.ISREJECTED = '0' `;

    return coreService.execute(sqlText);
}

service.recentAccountChanges = async (query) => {
    var sqlText = `SELECT PENDINGAPPROVALATTRIBUTE.ATTRIBUTE, PENDINGAPPROVALATTRIBUTE.NEWVALUE, PENDINGAPPROVALATTRIBUTE.CURRENTVALUE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE, 
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, PENDINGAPPROVALATTRIBUTE.APPROVED_DATE, PENDINGAPPROVALATTRIBUTE.APPROVED_BY
    FROM PRESENTATION.GOLDEN_ACCOUNT_D 
        INNER JOIN PRESENTATION.PENDINGAPPROVALATTRIBUTE ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER)
    WHERE GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}' AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = '1'
    ORDER BY PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY DESC`;

    return coreService.execute(sqlText);
};

service.xrefGoldenAccounts = async (query) => {
    var sqlText = `SELECT CUSTOMER_ACCOUNT_D.ACCOUNT_ID, CUSTOMER_ACCOUNT_D.ACCOUNT_NUMBER, CUSTOMER_ACCOUNT_D.ACCOUNT_NAME, CUSTOMER_ACCOUNT_D.LOGITECH_ACCOUNT_ID, CUSTOMER_ACCOUNT_D.COUNTRY, 
        CUSTOMER_ACCOUNT_D.ZYME_ID, CUSTOMER_ACCOUNT_D.VALID_ZYME_ID, CUSTOMER_ACCOUNT_D.VALID_ZYME_BUSINESS_NAME, CUSTOMER_ACCOUNT_D.CHANNEL_POSITION, GOLDEN_ACCOUNT_BRIDGE.GOLDEN_ACCOUNT_ID,
        CUSTOMER_ACCOUNT_D.MASTER_NAME, CUSTOMER_ACCOUNT_D.SOURCE_SYSTEM_NAME, CUSTOMER_ACCOUNT_D.CUST_NMBR_AT_DIST, CUSTOMER_ACCOUNT_D.UPDATED_DATE, CUSTOMER_ACCOUNT_D.CREATED_DATE,
        (SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END FROM PRESENTATION.PENDINGAPPROVALXREFACCOUNT WHERE PENDINGAPPROVALXREFACCOUNT.CUSTOMERACCOUNTPKEY = CUSTOMER_ACCOUNT_D.ACCOUNT_ID AND PENDINGAPPROVALXREFACCOUNT.ISREJECTED = 0 AND PENDINGAPPROVALXREFACCOUNT.ISAPPROVED = 0 ) AS CAN_REASSIGN_FLAG
    FROM PRESENTATION.CUSTOMER_ACCOUNT_D
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_BRIDGE ON CUSTOMER_ACCOUNT_D.ACCOUNT_ID = GOLDEN_ACCOUNT_BRIDGE.ACCOUNT_ID AND GOLDEN_ACCOUNT_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
    WHERE GOLDEN_ACCOUNT_BRIDGE.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}'
    AND CUSTOMER_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    ORDER BY CUSTOMER_ACCOUNT_D.ACCOUNT_ID `;

    return coreService.execute(sqlText);
};

service.xrefGoldenAccountInfo = async (query) => {
    var sqlText = `SELECT CUSTOMER_ACCOUNT_D.*
    FROM PRESENTATION.CUSTOMER_ACCOUNT_D
    WHERE CUSTOMER_ACCOUNT_D.LOGITECH_ACCOUNT_ID = '${query.logitechAccountId}'
    AND CUSTOMER_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' `;

    return coreService.execute(sqlText);
};

service.getXrefGoldenAccountInfoByAccountId = async (query) => {
    var sqlText = `SELECT CUSTOMER_ACCOUNT_D.*
    FROM PRESENTATION.CUSTOMER_ACCOUNT_D
    WHERE CUSTOMER_ACCOUNT_D.ACCOUNT_ID = '${query.ACCOUNT_ID}'
    AND CUSTOMER_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' `;

    return coreService.execute(sqlText);
};

service.xrefGoldenAccountSearch = async (query, paging = false) => {
    if (paging === true) {
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME, GOLDEN_ACCOUNT_D.LOGITECH_ACCOUNT_ID, GOLDEN_ACCOUNT_D.ACCOUNT_NUMBER, GOLDEN_ACCOUNT_D.ZYME_ID, 
        GOLDEN_ACCOUNT_D.VALID_ZYME_ID, GOLDEN_ACCOUNT_D.COUNTRY, GOLDEN_ACCOUNT_D.REGION `;
    }
    sqlText += `FROM PRESENTATION.GOLDEN_ACCOUNT_D  WHERE CURRENT_VERSION_FLAG = 'Y' `;
    if (query.accountNumber) {
        sqlText += `AND GOLDEN_ACCOUNT_D.ACCOUNT_NUMBER = '${query.accountNumber}' `;
    }
    if (query.logitechAccountId) {
        sqlText += `AND GOLDEN_ACCOUNT_D.LOGITECH_ACCOUNT_ID = '${query.logitechAccountId}' `;
    }
    if (query.validZymeId) {
        sqlText += `AND GOLDEN_ACCOUNT_D.VALID_ZYME_ID = '${query.validZymeId}' `;
    }
    if (query.goldenAccountName) {
        sqlText += `AND GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME like  '%${query.goldenAccountName}%' `;
    }
    if (query.validZymeBusinessName) {
        sqlText += `AND GOLDEN_ACCOUNT_D.VALID_ZYME_BUSINESS_NAME like '%${query.validZymeBusinessName}%' `;
    }
    if (query.countryCode) {
        sqlText += `AND GOLDEN_ACCOUNT_D.ERP_COUNTRY_CD = '${query.countryCode}' `;
    }
    if (query.orderField) {
        sqlText += `ORDER BY ${query.orderField} ${query.orderAsc} `;
    }
    if (paging === false) {
        sqlText += ` LIMIT ${query.limit} OFFSET ${query.offset} `;
    }
    return coreService.execute(sqlText);
};

service.xrefAccountSites = async (query, paging = false) => {
    if (paging === true) {
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT DISTINCT CUSTOMER_SITE_D.ACCOUNT_SITE_USE_TYPE, CUSTOMER_SITE_D.PRIMARY_FLAG, CUSTOMER_SITE_D.ACCOUNT_SITE_USE_ID,
        CASE WHEN CUSTOMER_SITE_D.ACCOUNT_SITE_USE_TYPE = 'STORE' THEN CUSTOMER_SITE_D.SOURCE_SYSTEM_REFERENCE ELSE '' END AS STORE_NUMBER, 
        '' AS STORE_NAME, CUSTOMER_LOCATION_D.ADDRESS_LINE1, CUSTOMER_LOCATION_D.ADDRESS_LINE2, CUSTOMER_LOCATION_D.CITY, CUSTOMER_LOCATION_D.STATE,
        CUSTOMER_LOCATION_D.POSTAL_CD, CUSTOMER_LOCATION_D.COUNTRY_NAME, CUSTOMER_SITE_D.LOGITECH_ACCOUNT_ID, CUSTOMER_LOCATION_D.ZYME_LOCATION_ID `;
    }
    sqlText += `FROM PRESENTATION.CUSTOMER_SITE_D
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_BRIDGE ON (GOLDEN_ACCOUNT_BRIDGE.ACCOUNT_ID = CUSTOMER_SITE_D.ACCOUNT_ID AND GOLDEN_ACCOUNT_BRIDGE.CURRENT_VERSION_FLAG = 'Y')
        LEFT JOIN PRESENTATION.CUSTOMER_LOCATION_BRIDGE ON CUSTOMER_LOCATION_BRIDGE.TYPE_ID = CUSTOMER_SITE_D.ACCOUNT_SITE_USE_ID AND CUSTOMER_LOCATION_BRIDGE.TYPE = 'Customer Site' AND CUSTOMER_LOCATION_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
        INNER JOIN PRESENTATION.CUSTOMER_LOCATION_D ON CUSTOMER_LOCATION_D.LOCATION_ID = CUSTOMER_LOCATION_BRIDGE.LOCATION_ID AND CUSTOMER_LOCATION_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE 
        CUSTOMER_SITE_D.CURRENT_VERSION_FLAG = 'Y' AND GOLDEN_ACCOUNT_BRIDGE.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}'
    ORDER BY ${query.orderField} ${query.orderAsc} `;

    if (paging === false && query.offset) {
        sqlText += ` LIMIT ${query.limit} OFFSET ${query.offset} `;
    } else if (paging === false) {
        sqlText += ` LIMIT ${query.limit} `;
    }

    return coreService.execute(sqlText);
};

service.xrefAccountSiteInfo = async (query) => {
    
    var sqlText = `SELECT CUSTOMER_SITE_D.*,
    CASE WHEN CUSTOMER_SITE_D.ACCOUNT_SITE_USE_TYPE = 'STORE' THEN CUSTOMER_SITE_D.SOURCE_SYSTEM_REFERENCE ELSE '' END AS STORE_NUMBER, 
    '' AS STORE_NAME, CUSTOMER_LOCATION_D.ADDRESS_LINE1, CUSTOMER_LOCATION_D.ADDRESS_LINE2, CUSTOMER_LOCATION_D.CITY, CUSTOMER_LOCATION_D.STATE,
    CUSTOMER_LOCATION_D.POSTAL_CD, CUSTOMER_LOCATION_D.COUNTRY_NAME, CUSTOMER_SITE_D.LOGITECH_ACCOUNT_ID, CUSTOMER_LOCATION_D.ZYME_LOCATION_ID 
    FROM PRESENTATION.CUSTOMER_SITE_D
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_BRIDGE ON (GOLDEN_ACCOUNT_BRIDGE.ACCOUNT_ID = CUSTOMER_SITE_D.ACCOUNT_ID AND GOLDEN_ACCOUNT_BRIDGE.CURRENT_VERSION_FLAG = 'Y')
        LEFT JOIN PRESENTATION.CUSTOMER_LOCATION_BRIDGE ON CUSTOMER_LOCATION_BRIDGE.TYPE_ID = CUSTOMER_SITE_D.ACCOUNT_SITE_USE_ID AND CUSTOMER_LOCATION_BRIDGE.TYPE = 'Customer Site' AND CUSTOMER_LOCATION_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
        INNER JOIN PRESENTATION.CUSTOMER_LOCATION_D ON CUSTOMER_LOCATION_D.LOCATION_ID = CUSTOMER_LOCATION_BRIDGE.LOCATION_ID AND CUSTOMER_LOCATION_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE 
        CUSTOMER_SITE_D.CURRENT_VERSION_FLAG = 'Y' AND CUSTOMER_SITE_D.ACCOUNT_SITE_USE_ID = '${query.ACCOUNT_SITE_USE_ID}' `;

    return coreService.execute(sqlText);
};

service.accountClassification = async (query) => {
    var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID, GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME,
        GOLDEN_ACCOUNT_ATTR.GOLDEN_ACCOUNT_ATTR_LOV_ID, GOLDEN_ACCOUNT_ATTR.GOLDEN_ACCOUNT_ATTR_VALUE,
        GOLDEN_ACCOUNT_ATTR.EFF_START_DATE, GOLDEN_ACCOUNT_ATTR.EFF_END_DATE
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D
    LEFT JOIN (
        SELECT GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE, GOLDEN_ACCOUNT_ATTR_BRIDGE.EFF_START_DATE, GOLDEN_ACCOUNT_ATTR_BRIDGE.EFF_END_DATE
        FROM PRESENTATION.GOLDEN_ACCOUNT_D
            INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID AND GOLDEN_ACCOUNT_ATTR_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
            INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D ON GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID
        WHERE GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}' AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    ) AS GOLDEN_ACCOUNT_ATTR ON GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME IN ('CHANNEL_CLASSIFICATION', 'PRICING_CLASSIFICATION', 'DR_CUSTOMER_TYPE', 'CHANNEL_GROUPING', 'CHINA_CITY',
            'BUSINESS_MARKET', 'BUYING_GROUP', 'B2B_CHANNEL', 'BUSINESS_TYPE', 'E_TAILER', 'APPLE_RESELLER', 'GFK_CLASSIFICATION', 'PRIORITY_CLASSIFICATION', 'T3_TERRITORY', 'TMall', 
            'EMEA_CHANNEL_CLASSIFICATION', 'AP_CHANNEL_CLASSIFICATION', 'LATAM_ACCOUNT_CLASSIFICATION', 'BRAZIL_ACCOUNT_CLASSIFICATION')
    ORDER BY GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME `;

    return coreService.execute(sqlText);
};

service.getReporting = async (query) => {
    var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID, GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME,
        GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID, GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE,
        GOLDEN_ACCOUNT_ATTR_BRIDGE.EFF_START_DATE, GOLDEN_ACCOUNT_ATTR_BRIDGE.EFF_END_DATE,
        PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY
    FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D
        LEFT JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D ON  GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG = 'Y'
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE ON GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID AND GOLDEN_ACCOUNT_ATTR_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_D ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}' AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' AND GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID
        LEFT JOIN PRESENTATION.PENDINGAPPROVALATTRIBUTE ON GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = PENDINGAPPROVALATTRIBUTE.ATTRIBUTE AND PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0 AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER = '${query.goldenAccountId}'
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME IN ('EDI_CAPABILITY', 'REPORTING_FILE_FORMAT', 'REPORTING_FORMAT', 'REPORTING_FREQUENCY', 'REPORTING_MODE', 
        'STORE_LEVEL_DATA', 'REPORTING_RTS_QUANTITY', 'REPORTING_RTD_QUANTITY', 'REPORTING_T2_BACKLOG', 'TRANSACTION_DATE', 'POS_CUSTOMER', 'TRANSACTION_LEVEL_DATA', 'B2B_ST_AS_BT')
        AND GOLDEN_ACCOUNT_ATTR_TYPE_D.CURRENT_VERSION_FLAG = 'Y'
    ORDER BY GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME`;

    return coreService.execute(sqlText);
};

service.goldenAccountContacts = async (query) => {
    var sqlText = `SELECT DISTINCT CUSTOMER_CONTACTS_D.CONTACT_ID, CUSTOMER_CONTACTS_D.FIRST_NAME, CUSTOMER_CONTACTS_D.LAST_NAME, CUSTOMER_CONTACTS_D.MIDDLE_NAME, 
        CUSTOMER_CONTACTS_D.EMPLOYEE_ID, CUSTOMER_CONTACTS_D.EMPLOYEE_TYPE, CUSTOMER_CONTACTS_D.EMAIL_ADDRESS, CUSTOMER_CONTACTS_D.PHONE_NO, CUSTOMER_CONTACTS_D.COLLECTOR_FLAG,
        CUSTOMER_CONTACTS_D.SALES_REP_FLAG, CUSTOMER_CONTACTS_D.JOB_TITLE, CUSTOMER_CONTACTS_BRIDGE.MANAGER_FLAG, CUSTOMER_CONTACTS_BRIDGE.PRIMARY_MANAGER_FLAG,
        CUSTOMER_CONTACTS_BRIDGE.EFF_START_DATE, CUSTOMER_CONTACTS_BRIDGE.EFF_END_DATE,
        (SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END FROM PRESENTATION.PENDINGAPPROVALCONTACTS WHERE PENDINGAPPROVALCONTACTS.CONTACT_ID = CUSTOMER_CONTACTS_D.CONTACT_ID) AS CAN_EDIT_FLAG
    FROM PRESENTATION.CUSTOMER_CONTACTS_D
        INNER JOIN PRESENTATION.CUSTOMER_CONTACTS_BRIDGE ON (CUSTOMER_CONTACTS_D.CONTACT_ID = CUSTOMER_CONTACTS_BRIDGE.CONTACT_ID AND CUSTOMER_CONTACTS_BRIDGE.TYPE_ID = '${query.goldenAccountId}'  AND CUSTOMER_CONTACTS_BRIDGE.TYPE = 'Golden Account' AND CUSTOMER_CONTACTS_BRIDGE.CURRENT_VERSION_FLAG = 'Y')
    WHERE CUSTOMER_CONTACTS_D.CURRENT_VERSION_FLAG = 'Y'
    ORDER BY ${query.orderField} ${query.orderAsc} `;

    return coreService.execute(sqlText);
};

service.searchGoldenAccountContacts = async (query) => {
    var sqlText = `SELECT DISTINCT(CUSTOMER_CONTACTS_D.CONTACT_ID), CUSTOMER_CONTACTS_D.FIRST_NAME, CUSTOMER_CONTACTS_D.MIDDLE_NAME, CUSTOMER_CONTACTS_D.LAST_NAME, CUSTOMER_CONTACTS_D.EMPLOYEE_ID, 
        CUSTOMER_CONTACTS_D.CONTACT_TYPE, CUSTOMER_CONTACTS_D.STATUS, CUSTOMER_CONTACTS_D.EMPLOYEE_TYPE, CUSTOMER_CONTACTS_D.JOB_TITLE, CUSTOMER_CONTACTS_D.EMAIL_ADDRESS, 
        CUSTOMER_CONTACTS_D.PHONE_NO, CUSTOMER_CONTACTS_D.SALES_REP_FLAG
    FROM PRESENTATION.CUSTOMER_CONTACTS_D
        INNER JOIN PRESENTATION.CUSTOMER_CONTACTS_BRIDGE ON CUSTOMER_CONTACTS_D.CONTACT_ID = CUSTOMER_CONTACTS_BRIDGE.CONTACT_ID 
        AND CUSTOMER_CONTACTS_BRIDGE.CURRENT_VERSION_FLAG = 'Y' 
        AND CUSTOMER_CONTACTS_BRIDGE.TYPE_ID = '${query.goldenAccountId}' AND CUSTOMER_CONTACTS_BRIDGE.TYPE = 'Golden Account'
    WHERE CUSTOMER_CONTACTS_D.CURRENT_VERSION_FLAG = 'Y' `;
    if (query.employeeID) {
        sqlText += `AND CUSTOMER_CONTACTS_D.EMPLOYEE_ID = '${query.employeeID}' `;
    }
    if (query.firstName) {
        sqlText += `AND CUSTOMER_CONTACTS_D.FIRST_NAME like '%${query.firstName}%' `;
    }
    if (query.lastName) {
        sqlText += `AND CUSTOMER_CONTACTS_D.LAST_NAME like '%${query.lastName}%' `;
    }
    if (query.middleName) {
        sqlText += `AND CUSTOMER_CONTACTS_D.MIDDLE_NAME like '%${query.middleName}%' `;
    }

    return coreService.execute(sqlText);
};

service.fetchNewContactPkey = async (query) => {
    var sqlText = `SELECT MAX(PENDINGAPPROVALCONTACTS.PENDAPP_CUSTOMER_CONTACTS_PKEY) AS PKEY FROM PRESENTATION.PENDINGAPPROVALCONTACTS `;

    return coreService.execute(sqlText);
};

service.addNewContact = async (query) => {
    var maxPKey = await coreService.execute(`SELECT MAX(PENDAPP_CUSTOMER_CONTACTS_PKEY) + 1 AS PKEY FROM PRESENTATION.PENDINGAPPROVALCONTACTS `);
    maxPKey = (maxPKey[0]) ? maxPKey[0].PKEY : 100;
    query.PENDAPP_CUSTOMER_CONTACTS_PKEY = maxPKey;
    for (attr in query) {
        if (query.hasOwnProperty(attr)) {
            if (query[attr] === null) {
                query[attr] = 'NULL';
            } else {
                query[attr] = "'" + query[attr] + "'";
            }
        }
    }

    var sqlText = `INSERT INTO PRESENTATION.PENDINGAPPROVALCONTACTS ( 
        PENDINGAPPROVALCONTACTS.PENDAPP_CUSTOMER_CONTACTS_PKEY, 
        PENDINGAPPROVALCONTACTS.CONTACT_ID, 
        PENDINGAPPROVALCONTACTS.FIRST_NAME,
        PENDINGAPPROVALCONTACTS.MIDDLE_NAME, 
        PENDINGAPPROVALCONTACTS.LAST_NAME, 
        PENDINGAPPROVALCONTACTS.CONTACT_TYPE, 
        PENDINGAPPROVALCONTACTS.STATUS, 
        PENDINGAPPROVALCONTACTS.EMPLOYEE_ID,
        PENDINGAPPROVALCONTACTS.EMPLOYEE_TYPE,
        PENDINGAPPROVALCONTACTS.JOB_TITLE,
        PENDINGAPPROVALCONTACTS.EMAIL_ADDRESS,
        PENDINGAPPROVALCONTACTS.PHONE_NO,
        PENDINGAPPROVALCONTACTS.COLLECTOR_FLAG,
        PENDINGAPPROVALCONTACTS.SALES_REP_FLAG,
        PENDINGAPPROVALCONTACTS.EFF_START_DATE,
        PENDINGAPPROVALCONTACTS.EFF_END_DATE,
        PENDINGAPPROVALCONTACTS.ISREJECTED,
        PENDINGAPPROVALCONTACTS.ISAPPROVED,
        PENDINGAPPROVALCONTACTS.SUBMITTED_BY,
        PENDINGAPPROVALCONTACTS.SUBMITTED_DATE,
        PENDINGAPPROVALCONTACTS.SUBMITTED_COMMENT,
        PENDINGAPPROVALCONTACTS.SOURCE_SYSTEM_REFERENCE_TYPE,
        PENDINGAPPROVALCONTACTS.SOURCE_SYSTEM_REFERENCE,
        PENDINGAPPROVALCONTACTS.SOURCE_SYSTEM_NAME,
        PENDINGAPPROVALCONTACTS.MANAGER_FLAG,
        PENDINGAPPROVALCONTACTS.CUSTOMER_CONTACTS_PKEY,
        PENDINGAPPROVALCONTACTS.GOLDEN_ACCOUNT_ID,
        PENDINGAPPROVALCONTACTS.CURRENT_VERSION_FLAG,
        PENDINGAPPROVALCONTACTS.ACTION_TYPE,
        PENDINGAPPROVALCONTACTS.LOGITECH_ACCOUNT_ID,
        PENDINGAPPROVALCONTACTS.PRIMARY_MANAGER_FLAG,
        PENDINGAPPROVALCONTACTS.CREATED_BY
) VALUES (
    ${query.PENDAPP_CUSTOMER_CONTACTS_PKEY},
    ${query.CONTACT_ID},
    ${query.FIRST_NAME},
    ${query.MIDDLE_NAME},
    ${query.LAST_NAME},
    ${query.CONTACT_TYPE},
    ${query.STATUS},
    ${query.EMPLOYEE_ID},
    ${query.EMPLOYEE_TYPE},
    ${query.JOB_TITLE},
    ${query.EMAIL_ADDRESS},
    ${query.PHONE_NO},
    ${query.COLLECTOR_FLAG},
    ${query.SALES_REP_FLAG},
    ${query.EFF_START_DATE},
    ${query.EFF_END_DATE},
    ${query.ISREJECTED},
    ${query.ISAPPROVED},
    ${query.SUBMITTED_BY},
    current_date(),
    ${query.SUBMITTED_COMMENT},
    ${query.SOURCE_SYSTEM_REFERENCE_TYPE},
    ${query.SOURCE_SYSTEM_REFERENCE},
    ${query.SOURCE_SYSTEM_NAME},
    ${query.MANAGER_FLAG},
    ${query.CUSTOMER_CONTACTS_PKEY},
    ${query.GOLDEN_ACCOUNT_ID},
    ${query.CURRENT_VERSION_FLAG},
    ${query.ACTION_TYPE},
    ${query.LOGITECH_ACCOUNT_ID},
    ${query.PRIMARY_MANAGER_FLAG},
    ${query.CREATED_BY} ) `;
    return coreService.execute(sqlText);
};

service.getMaxPendingApproveAttributePKey = async (query) => {
    var sqlText = `SELECT MAX(PENDINGAPPROVALATTRIBUTE_PKEY) AS PKEY FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE`;

    return coreService.execute(sqlText);
};

service.goldenAccountAttributesByGoldenAccountId = async (query) => {
    var sqlText = `SELECT DISTINCT(CUSTOMER_ACCOUNT_D.${query.attributeName}), GOLDEN_ACCOUNT_BRIDGE.GOLDEN_ACCOUNT_ID
        FROM PRESENTATION.CUSTOMER_ACCOUNT_D
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_BRIDGE ON GOLDEN_ACCOUNT_BRIDGE.ACCOUNT_ID = CUSTOMER_ACCOUNT_D.ACCOUNT_ID
        WHERE CUSTOMER_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
            AND GOLDEN_ACCOUNT_BRIDGE.CURRENT_VERSION_FLAG = 'Y'
            AND GOLDEN_ACCOUNT_BRIDGE.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}'
            AND CUSTOMER_ACCOUNT_D.${query.attributeName} <> ''
        ORDER BY CUSTOMER_ACCOUNT_D.${query.attributeName}`;

    return coreService.execute(sqlText);
};

service.goldenAccountAttributeChangeHistory = async (query) => {
    var sqlText = `SELECT PENDINGAPPROVALATTRIBUTE.NEWVALUE, PENDINGAPPROVALATTRIBUTE.CURRENTVALUE, PENDINGAPPROVALATTRIBUTE.STARTDATE,
        PENDINGAPPROVALATTRIBUTE.ENDDATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE,
        PENDINGAPPROVALATTRIBUTE.APPROVED_BY, PENDINGAPPROVALATTRIBUTE.APPROVED_DATE, PENDINGAPPROVALATTRIBUTE.ATTRIBUTE
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    INNER JOIN PRESENTATION.PENDINGAPPROVALATTRIBUTE ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER) AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${query.goldenAccountId}'
    AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = '1'
    AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = '${query.attributeName}'`;

    return coreService.execute(sqlText);
};

service.requestUpdateGoldenAccountAttribute = async (query) => {
    var maxPKey = await coreService.execute(`SELECT CASE WHEN MAX(PENDINGAPPROVALATTRIBUTE_PKEY) > 0 THEN MAX(PENDINGAPPROVALATTRIBUTE_PKEY) + 1 ELSE 100 END AS PKEY FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE `);
    query.PENDINGAPPROVALATTRIBUTE_PKEY = (maxPKey[0] && maxPKey[0].PKEY >= 1) ? maxPKey[0].PKEY : 100;

    var sqlText = `INSERT INTO PRESENTATION.PENDINGAPPROVALATTRIBUTE (
        PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY,
        PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER,
        PENDINGAPPROVALATTRIBUTE.LOGITECH_PARTY_ID,
        PENDINGAPPROVALATTRIBUTE.ATTRIBUTE,
        PENDINGAPPROVALATTRIBUTE.CURRENTVALUE,
        PENDINGAPPROVALATTRIBUTE.NEWVALUE,
        PENDINGAPPROVALATTRIBUTE.STARTDATE,
        PENDINGAPPROVALATTRIBUTE.ENDDATE,
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY,
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE,
        PENDINGAPPROVALATTRIBUTE.ISREJECTED,
        PENDINGAPPROVALATTRIBUTE.ISAPPROVED,
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT
    ) VALUES (
        '${query.PENDINGAPPROVALATTRIBUTE_PKEY}',
        '${query.GOLDENACCOUNTNUMBER}',
        '${query.LOGITECH_PARTY_ID}',
        '${query.ATTRIBUTE}',
        '${query.CURRENTVALUE}',
        '${query.NEWVALUE}',
        '${query.STARTDATE}',
        '${query.ENDDATE}',
        '${query.SUBMITTED_BY}',
        current_date(),
        ${query.ISREJECTED},
        ${query.ISAPPROVED},
        '${query.SUBMITTED_COMMENT}'
    ) `;

    return coreService.execute(sqlText);
};


service.searchLogitechPartyName = async (query) => {
    var sqlText = `SELECT DISTINCT(GOLDEN_ACCOUNT_D.LOGITECH_PARTY_NAME), GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID, GOLDEN_ACCOUNT_D.LOGITECH_PARTY_ID, GOLDEN_ACCOUNT_D.ERP_COUNTRY_CD
    FROM PRESENTATION.GOLDEN_ACCOUNT_D
    WHERE GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' 
    AND GOLDEN_ACCOUNT_D.LOGITECH_PARTY_NAME ILIKE ANY '%${query.searchText}%'
    ORDER BY GOLDEN_ACCOUNT_D.LOGITECH_PARTY_NAME `;

    return coreService.execute(sqlText);
};

service.getGoldenAccountAttrTypeInfo = async (query) => {
    var sqlText = `SELECT * FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D 
    WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = '${query.GOLDEN_ACCOUNT_ATTR_TYPE_NAME}'; `;

    return coreService.execute(sqlText);
}

service.requestApproveForListOfValues = async (query) => {
    var sqlText = `SELECT MAX(PENDINGAPPROVALFORLOV_PKEY) AS PKEY FROM PRESENTATION.PENDINGAPPROVALFORLOVS`;
    var maxPKey = await coreService.execute(sqlText);
    maxPKey = (maxPKey[0] && maxPKey[0].PKEY >= 1) ? (parseInt(maxPKey[0].PKEY) + 1) : 100;
    query.PENDINGAPPROVALFORLOV_PKEY = maxPKey;

    var sqlText = `INSERT INTO PRESENTATION.PENDINGAPPROVALFORLOVS (
        PENDINGAPPROVALFORLOV_PKEY,
        GOLDEN_ACCOUNT_ATTR_TYPE_ID,
        NEWVALUE, 
        STARTDATE,
        ENDDATE,
        ISREJECTED,
        ISAPPROVED,
        SUBMITTED_BY,
        SUBMITTED_DATE,
        SUBMITTED_COMMENT
    ) VALUES (
        '${query.PENDINGAPPROVALFORLOV_PKEY}',
        '${query.GOLDEN_ACCOUNT_ATTR_TYPE_ID}',
        '${query.NEWVALUE}',
        '${query.STARTDATE}',
        '${query.ENDDATE}',
        '0',
        '0',
        '${query.SUBMITTED_BY}',
        current_date(),
        '${query.SUBMITTED_COMMENT}'
    ) `;

    return coreService.execute(sqlText);
}

service.requestUpdateGoldenAccountContact = async (query) => {
    var sqlText = `SELECT MAX(PENDAPP_CUSTOMER_CONTACTS_PKEY) AS PKEY FROM PRESENTATION.PENDINGAPPROVALCONTACTS`;
    var maxPKey = await coreService.execute(sqlText);
    maxPKey = (maxPKey[0] && maxPKey[0].PKEY >= 1) ? (parseInt(maxPKey[0].PKEY) + 1) : 100;
    query.PENDAPP_CUSTOMER_CONTACTS_PKEY = maxPKey;

    var sqlText = `INSERT INTO PRESENTATION.PENDINGAPPROVALCONTACTS (
        PENDAPP_CUSTOMER_CONTACTS_PKEY,
        CONTACT_ID,
        FIRST_NAME,
        MIDDLE_NAME,
        LAST_NAME,
        CONTACT_TYPE,
        STATUS,
        EMPLOYEE_ID,
        EMPLOYEE_TYPE,
        JOB_TITLE,
        EMAIL_ADDRESS,
        PHONE_NO,
        COLLECTOR_FLAG,
        SALES_REP_FLAG,
        EFF_START_DATE,
        EFF_END_DATE,
        ISREJECTED,
        ISAPPROVED,
        SUBMITTED_BY,
        SUBMITTED_DATE,
        SUBMITTED_COMMENT,
        SOURCE_SYSTEM_REFERENCE_TYPE,
        SOURCE_SYSTEM_REFERENCE,
        SOURCE_SYSTEM_NAME,
        MANAGER_FLAG,
        CUSTOMER_CONTACTS_PKEY,
        GOLDEN_ACCOUNT_ID,
        CURRENT_VERSION_FLAG,
        ACTION_TYPE,
        LOGITECH_ACCOUNT_ID,
        PRIMARY_MANAGER_FLAG,
        CREATED_BY
    ) VALUES (
        '${query.PENDAPP_CUSTOMER_CONTACTS_PKEY}',
        '${query.CONTACT_ID}',
        '${query.FIRST_NAME}',
        '${query.MIDDLE_NAME}',
        '${query.LAST_NAME}',
        '${query.CONTACT_TYPE}',
        '${query.STATUS}',
        '${query.EMPLOYEE_ID}',
        '${query.EMPLOYEE_TYPE}',
        '${query.JOB_TITLE}',
        '${query.EMAIL_ADDRESS}',
        '${query.PHONE_NO}',
        '${query.COLLECTOR_FLAG}',
        '${query.SALES_REP_FLAG}',
        '${query.EFF_START_DATE}',
        '${query.EFF_END_DATE}',
        0,
        0,
        '${query.SUBMITTED_BY}',
        current_date(),
        '${query.SUBMITTED_COMMENT}',
        '${query.SOURCE_SYSTEM_REFERENCE_TYPE}',
        '${query.SOURCE_SYSTEM_REFERENCE}',
        '${query.SOURCE_SYSTEM_NAME}',
        '${query.MANAGER_FLAG}',
        '${query.CUSTOMER_CONTACTS_PKEY}',
        '${query.GOLDEN_ACCOUNT_ID}',
        'Y',
        '${query.ACTION_TYPE}',
        '${query.LOGITECH_ACCOUNT_ID}',
        '${query.PRIMARY_MANAGER_FLAG}',
        '${query.CREATED_BY}') `;

    return coreService.execute(sqlText);
}

service.reassignXrefAccount = async (query) => {
    var maxPKey = await coreService.execute(`SELECT CASE WHEN MAX(PENDINGAPPROVALXREFACCT_PKEY) > 0 THEN MAX(PENDINGAPPROVALXREFACCT_PKEY) + 1 ELSE 100 END AS PKEY FROM PRESENTATION.PENDINGAPPROVALXREFACCOUNT `);
    query.PENDINGAPPROVALXREFACCT_PKEY = (maxPKey[0] && maxPKey[0].PKEY >= 1) ? parseInt(maxPKey[0].PKEY) : 100;
    //var isExist = await coreService.execute(`SELECT COUNT(*) FROM PRESENTATION.PENDINGAPPROVALXREFACCOUNT WHERE CUSTOMERACCOUNTPKEY = '${query.ACCOUNT_ID}' AND ISREJECTED = '0' AND ISAPPROVED = '0'  `);

    var sqlText = `INSERT INTO PRESENTATION.PENDINGAPPROVALXREFACCOUNT (
        PENDINGAPPROVALXREFACCT_PKEY,
        CUSTOMERACCOUNTPKEY, 
        CURRENTVALUE, 
        NEWVALUE, 
        ISREJECTED, 
        ISAPPROVED, 
        SUBMITTED_BY, 
        SUBMITTED_DATE, 
        SUBMITTED_COMMENT, 
        STARTDATE, 
        ENDDATE 
    ) VALUES (
        '${query.PENDINGAPPROVALXREFACCT_PKEY}', 
        '${query.ACCOUNT_ID}', 
        '${query.CURRENT_GOLDEN_ACCOUNT_ID}', 
        '${query.NEW_GOLDEN_ACCOUNT_ID}', 
        0, 
        0, 
        '${query.CURRENT_USER_NAME}', 
        current_date(), 
        '${query.SUBMITTED_COMMENT}', 
        current_date(), 
        '${query.ENDDATE}'
    ) `;

    await coreService.execute(sqlText);
    return query.PENDINGAPPROVALXREFACCT_PKEY;
};

module.exports = service;