const coreService = require('./snowflake_core_service');
const { query } = require('express');
var service = {};

service.getAttributes = async (query, paging = false) => {
    if (paging === true) {
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT DISTINCT(PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY), GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID, GOLDEN_ACCOUNT_D.LOGITECH_ACCOUNT_ID, GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME, PENDINGAPPROVALATTRIBUTE.ATTRIBUTE, 
        CASE WHEN PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = 'Xref-Exclude From Grouping' AND PENDINGAPPROVALATTRIBUTE.CURRENTVALUE = 0 THEN '' ELSE PENDINGAPPROVALATTRIBUTE.CURRENTVALUE END AS CURRENTVALUE, 
        PENDINGAPPROVALATTRIBUTE.NEWVALUE, PENDINGAPPROVALATTRIBUTE.STARTDATE, PENDINGAPPROVALATTRIBUTE.ENDDATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, 
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT, PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT `;
    }
    sqlText += `FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE 
    INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_D ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER) AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0 AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0
    AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE <> 'Create_Its_Own_Flag'
    ORDER BY PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY DESC`;

    return coreService.execute(sqlText);
}

service.getPendingAttribute = async (pendingAttributePKey) => {

    var sqlText = `SELECT PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY, GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID, GOLDEN_ACCOUNT_D.LOGITECH_ACCOUNT_ID, GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME, PENDINGAPPROVALATTRIBUTE.ATTRIBUTE, 
    CASE WHEN PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = 'Xref-Exclude From Grouping' AND PENDINGAPPROVALATTRIBUTE.CURRENTVALUE = 0 THEN '' ELSE PENDINGAPPROVALATTRIBUTE.CURRENTVALUE END AS CURRENTVALUE, 
    PENDINGAPPROVALATTRIBUTE.NEWVALUE, PENDINGAPPROVALATTRIBUTE.STARTDATE, PENDINGAPPROVALATTRIBUTE.ENDDATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, 
    PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT, PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT 
    FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE 
    INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_D ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER) AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0 AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0
    AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE <> 'Create_Its_Own_Flag'
    AND PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY = '${pendingAttributePKey}' `;

    return coreService.execute(sqlText);
}

service.approvePendingAttribute = async (query) => {

    var goldenAccount = null;
    var pendingAttribute = await coreService.execute(`SELECT * FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE 
    WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0 AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE <> 'Create_Its_Own_Flag'
    AND PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY = '${query.PENDINGAPPROVALATTRIBUTE_PKEY}' `);
    pendingAttribute = (pendingAttribute[0]) ? pendingAttribute[0] : null;

    if (pendingAttribute && pendingAttribute.GOLDENACCOUNTNUMBER) {
        var goldenAccount = await coreService.execute(`SELECT * FROM PRESENTATION.GOLDEN_ACCOUNT_D 
        WHERE GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = '${pendingAttribute.GOLDENACCOUNTNUMBER}' AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' `);
        goldenAccount = (goldenAccount[0]) ? goldenAccount[0] : null;
    }

    if (pendingAttribute !== null && goldenAccount !== null) {

        pendingAttribute.STARTDATE = pendingAttribute.STARTDATE.toISOString().substring(0, 10);
        pendingAttribute.ENDDATE = pendingAttribute.ENDDATE.toISOString().substring(0, 10);
        pendingAttribute.SUBMITTED_DATE = (pendingAttribute.SUBMITTED_DATE) ? pendingAttribute.SUBMITTED_DATE.toISOString().substring(0, 10) : pendingAttribute.SUBMITTED_DATE;
        pendingAttribute.APPROVED_DATE = (pendingAttribute.APPROVED_DATE) ? pendingAttribute.APPROVED_DATE.toISOString().substring(0, 10) : pendingAttribute.APPROVED_DATE;

        goldenAccount.EFF_START_DATE = (goldenAccount.EFF_START_DATE) ? goldenAccount.EFF_START_DATE.toISOString().substring(0, 10) : goldenAccount.EFF_START_DATE;
        goldenAccount.EFF_END_DATE = (goldenAccount.EFF_END_DATE) ? goldenAccount.EFF_END_DATE.toISOString().substring(0, 10) : goldenAccount.EFF_END_DATE;
        goldenAccount.CREATED_DATE = (goldenAccount.CREATED_DATE) ? goldenAccount.CREATED_DATE.toISOString().substring(0, 10) : goldenAccount.CREATED_DATE;
        goldenAccount.CHANGE_SUBMITTED_DATE = (goldenAccount.CHANGE_SUBMITTED_DATE) ? goldenAccount.CHANGE_SUBMITTED_DATE.toISOString().substring(0, 10) : goldenAccount.CHANGE_SUBMITTED_DATE;
        goldenAccount.CHANGE_APPROVED_DATE = (goldenAccount.CHANGE_APPROVED_DATE) ? goldenAccount.CHANGE_APPROVED_DATE.toISOString().substring(0, 10) : goldenAccount.CHANGE_APPROVED_DATE;
        goldenAccount.EXCLUDE_MATCH_FLAG = goldenAccount.EXCLUDE_MATCH_FLAG === null ? 'NULL' : "'" + goldenAccount.EXCLUDE_MATCH_FLAG + "'";
        goldenAccount.CHANGE_SUBMITTED_COMMENTS = goldenAccount.CHANGE_SUBMITTED_COMMENTS === null ? 'NULL' : "'" + goldenAccount.CHANGE_SUBMITTED_COMMENTS + "'";
        goldenAccount.CHANGE_APPROVAL_COMMENTS = goldenAccount.CHANGE_APPROVAL_COMMENTS === null ? 'NULL' : "'" + goldenAccount.CHANGE_APPROVAL_COMMENTS + "'";
        goldenAccount.T3_MASTER_IDENTIFIER = goldenAccount.T3_MASTER_IDENTIFIER === null ? 'NULL' : "'" + goldenAccount.T3_MASTER_IDENTIFIER + "'";
        goldenAccount.INDUSTRY_CODE = goldenAccount.INDUSTRY_CODE === null ? 'NULL' : "'" + goldenAccount.INDUSTRY_CODE + "'";

        await coreService.execute(`UPDATE PRESENTATION.GOLDEN_ACCOUNT_D
        SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(day, -1, to_date('${pendingAttribute.STARTDATE}'))
        WHERE GOLDEN_ACCOUNT_ID = '${pendingAttribute.GOLDENACCOUNTNUMBER}' AND CURRENT_VERSION_FLAG = 'Y' `);

        goldenAccount.CURRENT_VERSION_FLAG = 'Y';

        switch (pendingAttribute.ATTRIBUTE) {
            case 'ACCOUNT_NUMBER':
            case 'GOLDEN_ACCOUNT_NAME':
            case 'VALID_ZYME_ID':
            case 'ACCRUAL':
            case 'VALID_ZYME_BIZ_NAME':
            case 'MASTER_NAME':
            case 'T3_MASTER_IDENTIFIER':
            case 'INDUSTRY_CODE': {
                goldenAccount[pendingAttribute.ATTRIBUTE] = pendingAttribute.NEWVALUE;
            }
                break;
            case 'ACCOUNT_NAME': {
                goldenAccount.GOLDEN_ACCOUNT_NAME = pendingAttribute.NEWVALUE;
            }
                break;
            case 'VALID_ZYME_BIZ_NAME': {
                goldenAccount.VALID_ZYME_BUSINESS_NAME = pendingAttribute.NEWVALUE;
            }
                break;
            case 'EXCLUDE_MATCH_FLAG':
            case 'EXCLUDE_FROM_GROUPING':
            case 'Xref-Exclude From Grouping': {
                goldenAccount.EXCLUDE_MATCH_FLAG = pendingAttribute.NEWVALUE;
            }
                break;
            case 'CUST_NMBR_AT_DIST':
            case 'RESELLER_CODE': {
                goldenAccount.CUST_NMBR_AT_DIST = pendingAttribute.NEWVALUE;
            }
                break;
            case 'ERP_COUNTRY_CD':
                var countryInfo = await coreService.execute(`SELECT DISTINCT(ERP_COUNTRY_CD), COUNTRY, REGION FROM PRESENTATION.GOLDEN_ACCOUNT_D
                WHERE COUNTRY <> '' AND ERP_COUNTRY_CD <> '' AND ERP_COUNTRY_CD <> 'XX' AND REGION <> '' AND CURRENT_VERSION_FLAG = 'Y'
                AND ERP_COUNTRY_CD = '${pendingAttribute.NEWVALUE}' `);
                countryInfo = (countryInfo[0]) ? countryInfo[0] : null;
                if (countryInfo) {
                    goldenAccount.ERP_COUNTRY_CD = countryInfo.ERP_COUNTRY_CD;
                    goldenAccount.REGION = countryInfo.REGION;
                    goldenAccount.COUNTRY = countryInfo.COUNTRY;
                }
            case 'COUNTRY': {
                var countryInfo = await coreService.execute(`SELECT DISTINCT(ERP_COUNTRY_CD), COUNTRY, REGION FROM PRESENTATION.GOLDEN_ACCOUNT_D
                WHERE COUNTRY <> '' AND ERP_COUNTRY_CD <> '' AND ERP_COUNTRY_CD <> 'XX' AND REGION <> '' AND CURRENT_VERSION_FLAG = 'Y'
                AND COUNTRY = '${pendingAttribute.NEWVALUE}' `);
                countryInfo = (countryInfo[0]) ? countryInfo[0] : null;
                if (countryInfo) {
                    goldenAccount.ERP_COUNTRY_CD = countryInfo.ERP_COUNTRY_CD;
                    goldenAccount.REGION = countryInfo.REGION;
                    goldenAccount.COUNTRY = countryInfo.COUNTRY;
                }
            }
                break;
            case 'LOGITECH_PARTY_ID':
            case 'CHANNEL_GROUPING_PARENT': {
                var partyNameInfo = await coreService.execute(`SELECT LOGITECH_PARTY_ID, LOGITECH_PARTY_NAME FROM PRESENTATION.GOLDEN_ACCOUNT_D
                WHERE CURRENT_VERSION_FLAG = 'Y' AND LOGITECH_PARTY_ID = '${pendingAttribute.NEWVALUE}' `);
                partyNameInfo = (partyNameInfo[0]) ? partyNameInfo[0] : null;

                if (partyNameInfo === null) {
                    var partyNameInfo = await coreService.execute(`SELECT CONCAT('P', TO_NUMBER(MAX(LTRIM(LOGITECH_PARTY_ID, 'P')) + 1)) AS LOGITECH_PARTY_ID FROM PRESENTATION.GOLDEN_ACCOUNT_D `);
                    partyNameInfo = (partyNameInfo[0]) ? partyNameInfo[0] : null;
                }

                if (partyNameInfo !== null) {
                    goldenAccount.LOGITECH_PARTY_NAME = pendingAttribute.NEWVALUE;
                    goldenAccount.LOGITECH_PARTY_ID = partyNameInfo.LOGITECH_PARTY_ID;
                }
            }
                break;
            default: {
                var lovInfoQuery = `SELECT 
                    GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_PKEY,
                    GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID,
                    GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
                FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D
                    LEFT JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D ON GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID 
                WHERE GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE = '${pendingAttribute.NEWVALUE}' 
                    AND GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = '${pendingAttribute.ATTRIBUTE}' `;
                var lovInfo = await coreService.execute(lovInfoQuery);
                lovInfo = (lovInfo[0]) ? lovInfo[0] : null;

                if (lovInfo === null) {
                    var maxAttrLov = await coreService.execute(`SELECT MAX(GOLDEN_ACCOUNT_ATTR_LOV_ID) + 1 AS MAX_PKEY FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_ID `);
                    maxAttrLov = (maxAttrLov[0]) ? maxAttrLov[0].MAX_PKEY : 100;

                    var attrLovType = await coreService.execute(`SELECT GOLDEN_ACCOUNT_ATTR_TYPE_ID FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D WHERE GOLDEN_ACCOUNT_ATTR_TYPE_NAME = '${pendingAttribute.ATTRIBUTE}' `);
                    attrLovType = (attrLovType[0]) ? attrLovType[0] : null;

                    if (attrLovType.GOLDEN_ACCOUNT_ATTR_TYPE_ID) {
                        var sqlText = `INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D
                        (
                            GOLDEN_ACCOUNT_ATTR_LOV_ID,
                            GOLDEN_ACCOUNT_ATTR_TYPE_ID,
                            GOLDEN_ACCOUNT_ATTR_VALUE,
                            EFF_START_DATE,
                            EFF_END_DATE,
                            CREATED_BY,
                            CREATED_DATE,
                            CHANGE_SUBMITTED_BY,
                            CHANGE_SUBMITTED_DATE,
                            CHANGE_APPROVED_BY,
                            CHANGE_APPROVED_DATE,
                            CURRENT_VERSION_FLAG,
                            CHANGE_SUBMITTED_COMMENTS,
                            CHANGE_APPROVAL_COMMENTS
                        ) VALUES (
                            '${maxAttrLov}',
                            '${attrLovType.GOLDEN_ACCOUNT_ATTR_TYPE_ID}',
                            '${pendingAttribute.NEWVALUE}',
                            '${pendingAttribute.STARTDATE}',
                            '${pendingAttribute.ENDDATE}',
                            '${query.CURRENT_USER_NAME}',
                            current_date(),
                            '${pendingAttribute.SUBMITTED_BY}',
                            '${pendingAttribute.SUBMITTED_DATE}',
                            '${query.CURRENT_USER_NAME}',
                            current_date(),
                            'Y',
                            '${pendingAttribute.APPROVED_COMMENT}',
                            '${pendingAttribute.SUBMITTED_COMMENT}'
                        ) `;

                        var lovInfo = await coreService.execute(lovInfoQuery);
                        lovInfo = (lovInfo[0]) ? lovInfo[0] : null;
                    }
                }
                if (lovInfo !== null) {
                    await coreService.execute(`UPDATE PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE
                    SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(day, -1, to_date('${pendingAttribute.STARTDATE}'))
                    WHERE GOLDEN_ACCOUNT_ID = '${pendingAttribute.GOLDENACCOUNTNUMBER}' AND CURRENT_VERSION_FLAG = 'Y' `);

                    var bridgeSqlText = `INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_ATTR_BRIDGE (
                        GOLDEN_ACCOUNT_ID,
                        GOLDEN_ACCOUNT_ATTR_LOV_ID, 
                        EFF_START_DATE,
                        EFF_END_DATE,
                        CURRENT_VERSION_FLAG,
                        CREATED_BY,
                        CREATED_DATE,
                        CHANGE_SUBMITTED_BY,
                        CHANGE_SUBMITTED_DATE,
                        CHANGE_APPROVED_BY,
                        CHANGE_SUBMITTED_COMMENTS,
                        CHANGE_APPROVAL_COMMENTS,
                    ) VALUES ( 
                        '${pendingAttribute.GOLDENACCOUNTNUMBER}',
                        '${lovInfo.GOLDEN_ACCOUNT_ATTR_LOV_ID}',
                        '${pendingAttribute.STARTDATE}',
                        '${pendingAttribute.ENDDATE}',
                        'Y',
                        '${query.CURRENT_USER_NAME}',
                        current_date(),
                        '${query.CURRENT_USER_NAME}',
                        '${pendingAttribute.SUBMITTED_DATE},
                        '${query.CURRENT_USER_NAME}',
                        '${pendingAttribute.SUBMITTED_COMMENT}',
                        '${pendingAttribute.APPROVED_COMMENT}'
                    ) `;

                    await coreService.execute(bridgeSqlText);
                } else {
                    throw { status: false, message: "Invalid GOLDEN_ACCOUNT_ATTR_TYPE or GOLDEN_ACCOUNT_ATTR_LOV" };
                }
            }
                break;
        }

        var sqlText = `INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_D (
            GOLDEN_ACCOUNT_ID,
            GOLDEN_ACCOUNT_TYPE_ID, 
            GOLDEN_ACCOUNT_NAME, 
            LOGITECH_ACCOUNT_ID, 
            ACCOUNT_NUMBER, 
            LOGITECH_PARTY_NAME, 
            LOGITECH_PARTY_ID, 
            ZYME_ID, 
            VALID_ZYME_ID, 
            VALID_ZYME_BUSINESS_NAME, 
            ERP_COUNTRY_CD, 
            COUNTRY, 
            REGION, 
            DEFAULT_SALES_CHANNEL, 
            CUSTOMER_TYPE, 
            CUST_NMBR_AT_DIST, 
            MASTER_NAME, 
            ACCRUAL, 
            ACCOUNT_STATUS, 
            EFF_START_DATE, 
            EFF_END_DATE, 
            EXCLUDE_MATCH_FLAG, 
            CURRENT_VERSION_FLAG, 
            CREATED_BY, 
            CREATED_DATE, 
            CHANGE_SUBMITTED_BY, 
            CHANGE_SUBMITTED_DATE, 
            CHANGE_SUBMITTED_COMMENTS, 
            CHANGE_APPROVED_BY, 
            CHANGE_APPROVED_DATE, 
            CHANGE_APPROVAL_COMMENTS, 
            T3_MASTER_IDENTIFIER,
            INDUSTRY_CODE,
            CRC_NUM, 
            RNK
        ) VALUES (
            '${goldenAccount.GOLDEN_ACCOUNT_ID}',
            '${goldenAccount.GOLDEN_ACCOUNT_TYPE_ID}',
            '${goldenAccount.GOLDEN_ACCOUNT_NAME}',
            '${goldenAccount.LOGITECH_ACCOUNT_ID}',
            '${goldenAccount.ACCOUNT_NUMBER}',
            '${goldenAccount.LOGITECH_PARTY_NAME}',
            '${goldenAccount.LOGITECH_PARTY_ID}',
            '${goldenAccount.ZYME_ID}',
            '${goldenAccount.VALID_ZYME_ID}',
            '${goldenAccount.VALID_ZYME_BUSINESS_NAME}',
            '${goldenAccount.ERP_COUNTRY_CD}',
            '${goldenAccount.COUNTRY}',
            '${goldenAccount.REGION}',
            '${goldenAccount.DEFAULT_SALES_CHANNEL}',
            '${goldenAccount.CUSTOMER_TYPE}',
            '${goldenAccount.CUST_NMBR_AT_DIST}',
            '${goldenAccount.MASTER_NAME}',
            '${goldenAccount.ACCRUAL}',
            '${goldenAccount.ACCOUNT_STATUS}',
            '${goldenAccount.EFF_START_DATE}',
            '${goldenAccount.EFF_END_DATE}',
            ${goldenAccount.EXCLUDE_MATCH_FLAG},
            '${goldenAccount.CURRENT_VERSION_FLAG}',
            '${goldenAccount.CREATED_BY}',
            '${goldenAccount.CREATED_DATE}',
            '${goldenAccount.CHANGE_SUBMITTED_BY}',
            '${goldenAccount.CHANGE_SUBMITTED_DATE}',
            ${goldenAccount.CHANGE_SUBMITTED_COMMENTS},
            '${goldenAccount.CHANGE_APPROVED_BY}',
            '${goldenAccount.CHANGE_APPROVED_DATE}',
            ${goldenAccount.CHANGE_APPROVAL_COMMENTS},
            ${goldenAccount.T3_MASTER_IDENTIFIER},
            ${goldenAccount.INDUSTRY_CODE},
            '${goldenAccount.CRC_NUM}',
            '${goldenAccount.RNK}'
        ) `;
        await coreService.execute(sqlText);

        await coreService.execute(`UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISAPPROVED = 1, 
        APPROVED_BY = '${query.CURRENT_USER_NAME}',
        APPROVED_DATE = current_date(),
        APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
        WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE_PKEY = '${pendingAttribute.PENDINGAPPROVALATTRIBUTE_PKEY}' `);

    }
    return { pendingAttribute };
}

service.rejectPendingAttributes = async (query) => {
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISREJECTED = 1
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE_PKEY IN (${query.PKEY_STRING}) `;

    return coreService.execute(sqlText);
}

/** List of values */
service.getPendigListOfValues = async (query, paging = false) => {

    if (paging === true) {
        query = await coreService.calPagenationValues(query);
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME, PENDINGAPPROVALFORLOVS.* `;
    }
    sqlText += `FROM PRESENTATION.PENDINGAPPROVALFORLOVS
    LEFT JOIN PRESENTATION.GOLDEN_ACCOUNT_ATTR_TYPE_D
    ON PENDINGAPPROVALFORLOVS.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
    WHERE PENDINGAPPROVALFORLOVS.ISREJECTED = 0
    AND PENDINGAPPROVALFORLOVS.ISAPPROVED = 0
    ORDER BY PENDINGAPPROVALFORLOVS.PENDINGAPPROVALFORLOV_PKEY DESC `;

    if (paging === false && query.offset) {
        sqlText += `LIMIT ${query.limit} OFFSET ${query.offset} `;
    } else if (paging === false) {
        sqlText += `LIMIT ${query.limit} `;
    }

    if (paging === true) {
        var rowsCount = await coreService.execute(sqlText);
        rowsCount = rowsCount[0]['ROW_COUNT'];
        return coreService.getPagenationObj(query, rowsCount);
    } else {
        return coreService.execute(sqlText);
    }
}

service.approvePendingListOfValue = async (query) => {

    var sqlText = `INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D 
    (
        GOLDEN_ACCOUNT_ATTR_LOV_ID, 
        GOLDEN_ACCOUNT_ATTR_TYPE_ID,
        GOLDEN_ACCOUNT_ATTR_VALUE,
        EFF_START_DATE,
        EFF_END_DATE,
        CREATED_BY,
        CREATED_DATE,
        CHANGE_SUBMITTED_BY,
        CHANGE_SUBMITTED_DATE,
        CHANGE_SUBMITTED_COMMENTS,
        CHANGE_APPROVED_BY,
        CHANGE_APPROVED_DATE,
        CURRENT_VERSION_FLAG,
        CHANGE_APPROVAL_COMMENTS
    )
    SELECT (SELECT MAX(GOLDEN_ACCOUNT_ATTR_LOV_ID) + 1 FROM PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D), 
        PENDINGAPPROVALFORLOVS.GOLDEN_ACCOUNT_ATTR_TYPE_ID,
        PENDINGAPPROVALFORLOVS.NEWVALUE,
        PENDINGAPPROVALFORLOVS.STARTDATE,
        PENDINGAPPROVALFORLOVS.ENDDATE,
        '${query.CURRENT_USER_NAME}',
        current_date(),
        PENDINGAPPROVALFORLOVS.SUBMITTED_BY,
        PENDINGAPPROVALFORLOVS.SUBMITTED_DATE,
        PENDINGAPPROVALFORLOVS.SUBMITTED_COMMENT,
        '${query.CURRENT_USER_NAME}',
        current_date(),
        'Y',
        '${query.APPROVED_COMMENT}'
    FROM PRESENTATION.PENDINGAPPROVALFORLOVS 
    WHERE PENDINGAPPROVALFORLOVS.ISREJECTED = 0 AND PENDINGAPPROVALFORLOVS.ISAPPROVED = 0 
        AND PENDINGAPPROVALFORLOVS.PENDINGAPPROVALFORLOV_PKEY = '${query.PENDINGAPPROVALFORLOV_PKEY}' `;
    return coreService.execute(sqlText);
}

service.approvePendingListOfValueStatus = async (query) => {
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALFORLOVS SET ISAPPROVED = 1, APPROVED_BY = '${query.CURRENT_USER_NAME}', 
    APPROVED_DATE = current_date(), APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND PENDINGAPPROVALFORLOV_PKEY = '${query.PENDINGAPPROVALFORLOV_PKEY}' `;

    return coreService.execute(sqlText);
}

service.rejectPendingListOfValues = async (query) => {
    query.keyString = query.PKEYS.join(", ");
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALFORLOVS SET ISREJECTED = 1
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND PENDINGAPPROVALFORLOV_PKEY IN (${query.keyString}) `;

    return coreService.execute(sqlText);
}

/** Own Flags */
service.getPendingOwnFlags = async (query, paging = false) => {

    if (paging === true) {
        query = await coreService.calPagenationValues(query);
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT DISTINCT(PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY), 
        PENDINGAPPROVALATTRIBUTE.NEWVALUE, 
        PENDINGAPPROVALATTRIBUTE.STARTDATE, 
        PENDINGAPPROVALATTRIBUTE.ENDDATE, 
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, 
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE, 
        PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT, 
        PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT, 
        CUSTOMER_ACCOUNT_D.* `;
    }
    sqlText += `FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE
        INNER JOIN PRESENTATION.CUSTOMER_ACCOUNT_D ON TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER) = CUSTOMER_ACCOUNT_D.ACCOUNT_ID
        AND CUSTOMER_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0
    AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0
    AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = 'Create_Its_Own_Flag' `;

    if (paging === false && query.offset) {
        sqlText += `LIMIT ${query.limit} OFFSET ${query.offset} `;
    } else if (paging === false) {
        sqlText += `LIMIT ${query.limit} `;
    }

    if (paging === true) {
        var rowsCount = await coreService.execute(sqlText);
        rowsCount = rowsCount[0]['ROW_COUNT'];
        return coreService.getPagenationObj(query, rowsCount);
    } else {
        return coreService.execute(sqlText);
    }
}

service.approvePendingOwnFlag = async (query) => {
    var xrefAccount = null;
    var pendingAttribute = await coreService.execute(`SELECT * FROM PRESENTATION.PENDINGAPPROVALATTRIBUTE 
    WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = 0 AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = 'Create_Its_Own_Flag'
    AND PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY = '${query.PENDINGAPPROVALATTRIBUTE_PKEY}' `);
    pendingAttribute = (pendingAttribute[0]) ? pendingAttribute[0] : null;

    if (pendingAttribute && pendingAttribute.GOLDENACCOUNTNUMBER) {
        var xrefAccount = await coreService.execute(`SELECT * FROM PRESENTATION.CUSTOMER_ACCOUNT_D 
        WHERE ACCOUNT_ID = '${pendingAttribute.GOLDENACCOUNTNUMBER}' AND CURRENT_VERSION_FLAG = 'Y' `);
        xrefAccount = (xrefAccount[0]) ? xrefAccount[0] : null;
    }

    if (pendingAttribute !== null && xrefAccount !== null) {

        pendingAttribute.STARTDATE = (pendingAttribute.STARTDATE) ? pendingAttribute.STARTDATE.toISOString().substring(0, 10) : pendingAttribute.STARTDATE;
        xrefAccount.CREATED_DATE = (xrefAccount.CREATED_DATE) ? xrefAccount.CREATED_DATE.toISOString().substring(0, 10) : xrefAccount.CREATED_DATE;
        xrefAccount.CHANGE_SUBMITTED_DATE = (xrefAccount.CHANGE_SUBMITTED_DATE) ? xrefAccount.CHANGE_SUBMITTED_DATE.toISOString().substring(0, 10) : xrefAccount.CHANGE_SUBMITTED_DATE;
        xrefAccount.EFF_START_DATE = (xrefAccount.EFF_START_DATE) ? xrefAccount.EFF_START_DATE.toISOString().substring(0, 10) : xrefAccount.EFF_START_DATE;
        xrefAccount.EFF_END_DATE = (xrefAccount.EFF_END_DATE) ? xrefAccount.EFF_END_DATE.toISOString().substring(0, 10) : xrefAccount.EFF_END_DATE;
        for (attr in xrefAccount) {
            if (xrefAccount.hasOwnProperty(attr)) {
                if (xrefAccount[attr] === null) {
                    xrefAccount[attr] = 'NULL';
                } else {
                    xrefAccount[attr] = "'" + xrefAccount[attr] + "'";
                }
            }
        }

        await coreService.execute(`UPDATE PRESENTATION.CUSTOMER_ACCOUNT_D
        SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(day, -1, to_date('${pendingAttribute.STARTDATE}'))
        WHERE ACCOUNT_ID = '${pendingAttribute.GOLDENACCOUNTNUMBER}' AND CURRENT_VERSION_FLAG = 'Y' `);

        var sqlText = `INSERT INTO PRESENTATION.CUSTOMER_ACCOUNT_D
        (
            ACCOUNT_ID,
            LOGITECH_ACCOUNT_ID,
            ACCOUNT_NAME,
            ACCOUNT_NUMBER,
            PARTY_ID,
            LOGITECH_PARTY_ID,
            PARTY_NAME,
            ACCOUNT_TIER,
            ACCOUNT_STATUS,
            ZYME_ID,
            VALID_ZYME_ID,
            VALID_ZYME_BUSINESS_NAME,
            CHANNEL_POSITION,
            COUNTRY,
            REGION,
            ERP_COUNTRY_CD,
            GEO_KEY,
            CUSTOMER_CLASS_CODE,
            DEFAULT_SALES_CHANNEL,
            CUSTOMER_TYPE,
            CUST_NMBR_AT_DIST,
            MASTER_NAME,
            ACCRUAL,
            SOURCE_SYSTEM_REFERENCE_TYPE,
            SOURCE_SYSTEM_REFERENCE,
            SOURCE_SYSTEM_NAME,
            EFF_START_DATE,
            EFF_END_DATE,
            CREATE_ITS_OWN_GOLDEN_FLAG,
            CURRENT_VERSION_FLAG,
            CREATED_BY,
            CREATED_DATE,
            UPDATE_BY,
            UPDATED_DATE,
            CHANGE_SUBMITTED_BY,
            CHANGE_SUBMITTED_DATE,
            CHANGE_APPROVED_BY,
            CHANGE_APPROVED_DATE,
            CHANGE_APPROVAL_COMMENTS,
            CRC_NUM,
            RNK
        ) VALUES (
            ${xrefAccount.ACCOUNT_ID},
            ${xrefAccount.LOGITECH_ACCOUNT_ID},
            ${xrefAccount.ACCOUNT_NAME},
            ${xrefAccount.ACCOUNT_NUMBER},
            ${xrefAccount.PARTY_ID},
            ${xrefAccount.LOGITECH_PARTY_ID},
            ${xrefAccount.PARTY_NAME},
            ${xrefAccount.ACCOUNT_TIER},
            ${xrefAccount.ACCOUNT_STATUS},
            ${xrefAccount.ZYME_ID},
            ${xrefAccount.VALID_ZYME_ID},
            ${xrefAccount.VALID_ZYME_BUSINESS_NAME},
            ${xrefAccount.CHANNEL_POSITION},
            ${xrefAccount.COUNTRY},
            ${xrefAccount.REGION},
            ${xrefAccount.ERP_COUNTRY_CD},
            ${xrefAccount.GEO_KEY},
            ${xrefAccount.CUSTOMER_CLASS_CODE},
            ${xrefAccount.DEFAULT_SALES_CHANNEL},
            ${xrefAccount.CUSTOMER_TYPE},
            ${xrefAccount.CUST_NMBR_AT_DIST},
            ${xrefAccount.MASTER_NAME},
            ${xrefAccount.ACCRUAL},
            ${xrefAccount.SOURCE_SYSTEM_REFERENCE_TYPE},
            ${xrefAccount.SOURCE_SYSTEM_REFERENCE},
            ${xrefAccount.SOURCE_SYSTEM_NAME},
            ${xrefAccount.EFF_START_DATE},
            ${xrefAccount.EFF_END_DATE},
            ${xrefAccount.CREATE_ITS_OWN_GOLDEN_FLAG},
            'Y',
            ${xrefAccount.CREATED_BY},
            ${xrefAccount.CREATED_DATE},
            '${query.CURRENT_USER_NAME}',
            current_date(),
            ${xrefAccount.CHANGE_SUBMITTED_BY},
            ${xrefAccount.CHANGE_SUBMITTED_DATE},
            '${query.CURRENT_USER_NAME}',
            current_date(),
            ${xrefAccount.CHANGE_APPROVAL_COMMENTS},
            ${xrefAccount.CRC_NUM},
            ${xrefAccount.RNK}
        ) `;
        await coreService.execute(sqlText);

        await coreService.execute(`UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISAPPROVED = 1, 
        APPROVED_BY = '${query.CURRENT_USER_NAME}',
        APPROVED_DATE = current_date(),
        APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
        WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND PENDINGAPPROVALATTRIBUTE_PKEY = '${pendingAttribute.PENDINGAPPROVALATTRIBUTE_PKEY}' `);
    }
    return { pendingAttribute };
}

service.rejectPendingOwnFlags = async (query) => {
    query.keyString = query.PKEYS.join(", ");
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISREJECTED = 1, APPROVED_BY = '${query.CURRENT_USER_NAME}', 
    APPROVED_DATE = current_date(), APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND ATTRIBUTE = 'Create_Its_Own_Flag' AND PENDINGAPPROVALATTRIBUTE_PKEY IN (${query.keyString}) `;

    return coreService.execute(sqlText);
}

/** Xref Grouping */
service.getPendingXrefGroupings = async (query, paging = false) => {

    if (paging === true) {
        query = await coreService.calPagenationValues(query);
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT PENDINGAPPROVALXREFACCOUNT.* `;
    }
    sqlText += `FROM PRESENTATION.PENDINGAPPROVALXREFACCOUNT
    WHERE PENDINGAPPROVALXREFACCOUNT.ISREJECTED = 0
    AND PENDINGAPPROVALXREFACCOUNT.ISAPPROVED = 0  
    ORDER BY PENDINGAPPROVALXREFACCT_PKEY DESC `;

    if (paging === false && query.offset) {
        sqlText += `LIMIT ${query.limit} OFFSET ${query.offset} `;
    } else if (paging === false) {
        sqlText += `LIMIT ${query.limit} `;
    }

    if (paging === true) {
        var rowsCount = await coreService.execute(sqlText);
        rowsCount = rowsCount[0]['ROW_COUNT'];
        return coreService.getPagenationObj(query, rowsCount);
    } else {
        return coreService.execute(sqlText);
    }
}

service.approvePendingXrefGrouping = async (query) => {

    var pendingXref = await coreService.execute(`SELECT PENDINGAPPROVALXREFACCOUNT.* FROM PRESENTATION.PENDINGAPPROVALXREFACCOUNT
    WHERE PENDINGAPPROVALXREFACCOUNT.ISREJECTED = 0 AND PENDINGAPPROVALXREFACCOUNT.ISAPPROVED = 0
    AND PENDINGAPPROVALXREFACCOUNT.PENDINGAPPROVALXREFACCT_PKEY = '${query.PENDINGAPPROVALXREFACCT_PKEY}' `);
    pendingXref = (pendingXref[0]) ? pendingXref[0] : null;

    if (pendingXref !== null) {
        pendingXref.STARTDATE = pendingXref.STARTDATE.toISOString().substring(0, 10);
        pendingXref.ENDDATE = pendingXref.ENDDATE.toISOString().substring(0, 10);
        pendingXref.SUBMITTED_DATE = pendingXref.SUBMITTED_DATE.toISOString().substring(0, 10);

        var updateResult = await coreService.execute(`UPDATE PRESENTATION.GOLDEN_ACCOUNT_BRIDGE 
        SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(DAY , -1, to_date('${pendingXref.STARTDATE}'))
        WHERE ACCOUNT_ID = '${pendingXref.CUSTOMERACCOUNTPKEY}' AND CURRENT_VERSION_FLAG = 'Y' `);

        var sqlText = `INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_BRIDGE
        (
            ACCOUNT_ID,
            GOLDEN_ACCOUNT_ID,
            EFF_START_DATE,
            EFF_END_DATE,
            CURRENT_VERSION_FLAG,
            CHANGE_SUBMITTED_BY,
            CHANGE_SUBMITTED_DATE,
            CHANGE_APPROVED_BY,
            CHANGE_APPROVED_DATE,
            CREATED_BY,
            CREATED_DATE,
            UPDATED_BY,
            UPDATED_DATE,
            CHANGE_SUBMITTED_COMMENTS,
            CHANGE_APPROVAL_COMMENTS
        ) VALUES (
            '${pendingXref.CUSTOMERACCOUNTPKEY}', 
            '${pendingXref.NEWVALUE}',
            '${pendingXref.STARTDATE}',
            '${pendingXref.ENDDATE}',
            'Y',
            '${pendingXref.SUBMITTED_BY}',
            '${pendingXref.SUBMITTED_DATE}',
            '${query.CURRENT_USER_NAME}',
            current_date(),
            '${pendingXref.SUBMITTED_BY}',
            current_date(),
            '${query.CURRENT_USER_NAME}',
            current_date(),
            '${pendingXref.SUBMITTED_COMMENTS}',
            '${pendingXref.APPROVAL_COMMENTS}'
        ) `;
        var xrefAccountResult = await coreService.execute(sqlText);

        await coreService.execute(`UPDATE PRESENTATION.PENDINGAPPROVALXREFACCOUNT SET ISAPPROVED = 1
        WHERE PENDINGAPPROVALXREFACCT_PKEY = '${query.PENDINGAPPROVALXREFACCT_PKEY}' `);

        return { pendingXref, xrefAccountResult };
    } else {
        return { pendingXref: false };
    }
}

service.rejectPendingXrefGroupings = async (query) => {
    query.keyString = query.PKEYS.join(", ");
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISREJECTED = 1, APPROVED_BY = '${query.CURRENT_USER_NAME}', 
    APPROVED_DATE = current_date(), APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND ATTRIBUTE = 'Create_Its_Own_Flag' AND PENDINGAPPROVALATTRIBUTE_PKEY IN (${query.keyString}) `;

    return coreService.execute(sqlText);
}

/** Contacts */
service.getPendingContacts = async (query, paging = false) => {

    if (paging === true) {
        query = await coreService.calPagenationValues(query);
        var sqlText = `SELECT COUNT(*) AS ROW_COUNT `;
    } else {
        var sqlText = `SELECT GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME,
        GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID,
        PENDINGAPPROVALCONTACTS.*,
        CUSTOMER_CONTACTS_D.CRC_NUM,
        CUSTOMER_CONTACTS_D.RNK `;
    }
    sqlText += `FROM PRESENTATION.PENDINGAPPROVALCONTACTS
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_D ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALCONTACTS.GOLDEN_ACCOUNT_ID AS INTEGER) AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
        LEFT JOIN PRESENTATION.CUSTOMER_CONTACTS_D ON PENDINGAPPROVALCONTACTS.CONTACT_ID = CUSTOMER_CONTACTS_D.CONTACT_ID AND CUSTOMER_CONTACTS_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE PENDINGAPPROVALCONTACTS.ISREJECTED = 0
    AND PENDINGAPPROVALCONTACTS.ISAPPROVED = 0
    AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y' `;

    if (paging === false && query.offset) {
        sqlText += `LIMIT ${query.limit} OFFSET ${query.offset} `;
    } else if (paging === false) {
        sqlText += `LIMIT ${query.limit} `;
    }

    if (paging === true) {
        var rowsCount = await coreService.execute(sqlText);
        rowsCount = rowsCount[0]['ROW_COUNT'];
        return coreService.getPagenationObj(query, rowsCount);
    } else {
        return coreService.execute(sqlText);
    }
}

service.approvePendingContact = async (query) => {
    var pendingContact = null;
    var contactObj = {};
    var contactBridge = {};
    var isNewContact = false;

    var sqlText = `SELECT PENDINGAPPROVALCONTACTS.*, CUSTOMER_CONTACTS_D.CRC_NUM, CUSTOMER_CONTACTS_D.RNK
    FROM PRESENTATION.PENDINGAPPROVALCONTACTS
        INNER JOIN PRESENTATION.GOLDEN_ACCOUNT_D ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALCONTACTS.GOLDEN_ACCOUNT_ID AS INTEGER) AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'    
        LEFT JOIN PRESENTATION.CUSTOMER_CONTACTS_D ON PENDINGAPPROVALCONTACTS.CONTACT_ID = CUSTOMER_CONTACTS_D.CONTACT_ID AND CUSTOMER_CONTACTS_D.CURRENT_VERSION_FLAG = 'Y'
    WHERE PENDINGAPPROVALCONTACTS.ISREJECTED = 0 AND PENDINGAPPROVALCONTACTS.ISAPPROVED = 0 AND GOLDEN_ACCOUNT_D.CURRENT_VERSION_FLAG = 'Y'
        AND PENDINGAPPROVALCONTACTS.PENDAPP_CUSTOMER_CONTACTS_PKEY = '${query.PENDAPP_CUSTOMER_CONTACTS_PKEY}' `;

    var pendingContact = await coreService.execute(sqlText);
    pendingContact = (pendingContact[0]) ? pendingContact[0] : null;

    if (pendingContact && pendingContact.CONTACT_ID) {
        var sqlText = `SELECT * FROM PRESENTATION.CUSTOMER_CONTACTS_D
        WHERE CONTACT_ID = '${pendingContact.CONTACT_ID}' AND CURRENT_VERSION_FLAG = 'Y' `;

        contactObj = await coreService.execute(sqlText);
        contactObj = (contactObj[0]) ? contactObj[0] : {};
    }

    if (pendingContact) {
        pendingContact.EFF_START_DATE = pendingContact.EFF_START_DATE.toISOString().substring(0, 10);
        pendingContact.EFF_END_DATE = pendingContact.EFF_END_DATE.toISOString().substring(0, 10);
        if (pendingContact.CONTACT_ID == "") {
            isNewContact = true;
            var newContentPkey = await coreService.execute(`SELECT MAX(CONTACT_ID) + 1 AS ROW_MAX FROM PRESENTATION.CUSTOMER_CONTACTS_D `);
            newContentPkey = (newContentPkey[0]) ? newContentPkey[0].ROW_MAX : null;
            pendingContact.CONTACT_ID = newContentPkey;
        } else {
            await coreService.execute(`UPDATE PRESENTATION.CUSTOMER_CONTACTS_D 
                SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(DAY , -1, to_date('${pendingContact.EFF_START_DATE}'))
            WHERE CONTACT_ID = '${pendingContact.CONTACT_ID}' `);

            contactBridge = await coreService.execute(`SELECT CUSTOMER_CONTACTS_BRIDGE.* FROM PRESENTATION.CUSTOMER_CONTACTS_BRIDGE 
            WHERE TYPE_ID = '${pendingContact.GOLDEN_ACCOUNT_ID}' AND CONTACT_ID = '${pendingContact.CONTACT_ID}'
            AND TYPE = 'Golden Account' AND CURRENT_VERSION_FLAG = 'Y' `);
            contactBridge = (contactBridge[0]) ? contactBridge[0] : {};
        }
        if (contactObj && contactObj.CREATED_DATE) {
            pendingContact.CREATED_DATE = contactObj.CREATED_DATE.toISOString().substring(0, 10);
        }

        var sqlText = `INSERT INTO PRESENTATION.CUSTOMER_CONTACTS_D
        (
            CONTACT_ID,
            CONTACT_TYPE,
            FIRST_NAME,
            MIDDLE_NAME,
            LAST_NAME,
            STATUS,
            EMPLOYEE_ID,
            EMPLOYEE_TYPE,
            JOB_TITLE,
            EMAIL_ADDRESS,
            PHONE_NO,
            COLLECTOR_FLAG,
            SALES_REP_FLAG,
            SOURCE_SYSTEM_REFERENCE_TYPE,
            SOURCE_SYSTEM_REFERENCE,
            SOURCE_SYSTEM_NAME,
            EFF_START_DATE,
            EFF_END_DATE,
            CURRENT_VERSION_FLAG,
            CREATED_BY,
            CREATED_DATE,
            UPDATE_BY,
            UPDATED_DATE,
            CRC_NUM,
            RNK
        ) VALUES (
            '${pendingContact.CONTACT_ID}',
            '${pendingContact.CONTACT_TYPE}',
            '${pendingContact.FIRST_NAME}',
            '${pendingContact.MIDDLE_NAME}',
            '${pendingContact.LAST_NAME}',
            '${pendingContact.STATUS}',
            '${pendingContact.EMPLOYEE_ID}',
            '${pendingContact.EMPLOYEE_TYPE}',
            '${pendingContact.JOB_TITLE}',
            '${pendingContact.EMAIL_ADDRESS}',
            '${pendingContact.PHONE_NO}',
            '${pendingContact.COLLECTOR_FLAG}',
            '${pendingContact.SALES_REP_FLAG}',
            '${pendingContact.SOURCE_SYSTEM_REFERENCE_TYPE}',
            '${pendingContact.SOURCE_SYSTEM_REFERENCE}',
            '${pendingContact.SOURCE_SYSTEM_NAME}',
            '${pendingContact.EFF_START_DATE}',
            '${pendingContact.EFF_END_DATE}',
            'Y',
            '${pendingContact.CREATED_BY}',
            ${pendingContact.CREATED_DATE ? "'" + pendingContact.CREATED_DATE + "'" : "current_date()"},
            '${query.CURRENT_USER_NAME}',
            current_date(),
            '1',
            ${pendingContact.RNK}
        ) `;

        await coreService.execute(sqlText);

        if (isNewContact === true ||
            pendingContact.MANAGER_FLAG !== contactBridge.MANAGER_FLAG ||
            pendingContact.EFF_START_DATE !== contactBridge.EFF_START_DATE ||
            pendingContact.EFF_END_DATE !== contactBridge.EFF_END_DATE ||
            pendingContact.PRIMARY_MANAGER_FLAG !== contactBridge.PRIMARY_MANAGER_FLAG) {

            if (isNewContact === false) {
                await coreService.execute(`UPDATE PRESENTATION.CUSTOMER_CONTACTS_BRIDGE
                SET CURRENT_VERSION_FLAG = 'N', EFF_END_DATE = DATEADD(day, -1, to_date('${pendingContact.EFF_START_DATE}'))
                WHERE CONTACT_ID = '${pendingContact.CONTACT_ID}' AND CURRENT_VERSION_FLAG = 'Y' `);
            } else {
                pendingContact.RNK = CRC_NUM;
                pendingContact.RNK = NULL;
            }

            var sqlText = `INSERT INTO PRESENTATION.CUSTOMER_CONTACTS_BRIDGE
            (
                TYPE,
                TYPE_ID,
                CONTACT_ID,
                MANAGER_FLAG,
                PRIMARY_MANAGER_FLAG,
                SOURCE_SYSTEM_REFERENCE_TYPE,
                SOURCE_SYSTEM_REFERENCE,
                SOURCE_SYSTEM_NAME,
                EFF_START_DATE,
                EFF_END_DATE,
                CURRENT_VERSION_FLAG,
                CREATED_BY,
                CREATED_DATE,
                UPDATE_BY,
                UPDATED_DATE,
                CRC_NUM,
                RNK
            )
            VALUES
            (
                'Golden Account',
                '${pendingContact.GOLDEN_ACCOUNT_ID}',
                '${pendingContact.CONTACT_ID}',
                '${pendingContact.MANAGER_FLAG}',
                '${pendingContact.PRIMARY_MANAGER_FLAG}',
                '${pendingContact.SOURCE_SYSTEM_REFERENCE_TYPE}',
                '${pendingContact.SOURCE_SYSTEM_REFERENCE}',
                '${pendingContact.SOURCE_SYSTEM_NAME}',
                '${pendingContact.EFF_START_DATE}',
                '${pendingContact.EFF_END_DATE}',
                '${pendingContact.CURRENT_VERSION_FLAG}',
                '${query.CURRENT_USER_NAME}',
                '${pendingContact.CREATED_DATE}',
                '${query.CURRENT_USER_NAME}',
                current_date(),
                ${pendingContact.CRC_NUM},
                ${pendingContact.RNK}
            ) `;

            await coreService.execute(sqlText);
        }

        await coreService.execute(`UPDATE PRESENTATION.PENDINGAPPROVALCONTACTS SET ISAPPROVED = 1,
            APPROVED_BY = '${query.CURRENT_USER_NAME}', APPROVED_DATE = current_date(), APPROVED_COMMENT = '${pendingContact.APPROVED_COMMENT}'
            WHERE PENDAPP_CUSTOMER_CONTACTS_PKEY = '${pendingContact.PENDAPP_CUSTOMER_CONTACTS_PKEY}' `);
    }

    return { pendingContact, contact: contactObj };
}

service.rejectPendingContacts = async (query) => {
    query.keyString = query.PKEYS.join(", ");
    var sqlText = `UPDATE PRESENTATION.PENDINGAPPROVALATTRIBUTE SET ISREJECTED = 1, APPROVED_BY = '${query.CURRENT_USER_NAME}', 
    APPROVED_DATE = current_date(), APPROVED_COMMENT = '${query.APPROVED_COMMENT}'
    WHERE ISREJECTED = 0 AND ISAPPROVED = 0 AND ATTRIBUTE = 'Create_Its_Own_Flag' AND PENDINGAPPROVALATTRIBUTE_PKEY IN (${query.keyString}) `;

    return coreService.execute(sqlText);
}

module.exports = service;