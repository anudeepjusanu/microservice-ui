SELECT PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY, GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID, GOLDEN_ACCOUNT_D.LOGITECH_ACCOUNT_ID, GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_NAME, PENDINGAPPROVALATTRIBUTE.ATTRIBUTE, 
	CASE WHEN PENDINGAPPROVALATTRIBUTE.ATTRIBUTE = 'Xref-Exclude From Grouping' AND PENDINGAPPROVALATTRIBUTE.CURRENTVALUE = 0 THEN '' ELSE PENDINGAPPROVALATTRIBUTE.CURRENTVALUE END AS CURRENTVALUE,
	PENDINGAPPROVALATTRIBUTE.NEWVALUE, PENDINGAPPROVALATTRIBUTE.STARTDATE, PENDINGAPPROVALATTRIBUTE.ENDDATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY, 
	PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE, PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT, PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT
FROM PRESENTATION.GOLDEN_ACCOUNT_D
INNER JOIN PRESENTATION.PENDINGAPPROVALATTRIBUTE ON GOLDEN_ACCOUNT_D.GOLDEN_ACCOUNT_ID = TRY_CAST(PENDINGAPPROVALATTRIBUTE.GOLDENACCOUNTNUMBER AS INTEGER)
WHERE PENDINGAPPROVALATTRIBUTE.ISREJECTED = '0'
	AND PENDINGAPPROVALATTRIBUTE.ISAPPROVED = '1'
	AND PENDINGAPPROVALATTRIBUTE.ATTRIBUTE <> 'Create_Its_Own_Flag'
ORDER BY PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY DESC;


switch @selected_PENDINGAPPROVALATTRIBUTE.ATTRIBUTE {
    case "VALID_ZYME_ID":
        UPDATE GOLDEN_ACCOUNT_D
        SET VALID_ZYME_ID = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "ACCOUNT_NUMBER":
        UPDATE GOLDEN_ACCOUNT_D
        SET ACCOUNT_NUMBER = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "ACCOUNT_NAME":
        UPDATE GOLDEN_ACCOUNT_D
        SET GOLDEN_ACCOUNT_NAME = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "ACCRUAL":
        UPDATE GOLDEN_ACCOUNT_D
        SET ACCRUAL = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "VALID_ZYME_BIZ_NAME":
        UPDATE GOLDEN_ACCOUNT_D
        SET VALID_ZYME_BUSINESS_NAME = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "MASTER_NAME":
        UPDATE GOLDEN_ACCOUNT_D
        SET MASTER_NAME = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "Xref-Exclude From Grouping":
        UPDATE GOLDEN_ACCOUNT_D
        SET EXCLUDE_MATCH_FLAG = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "T3_MASTER_IDENTIFIER":
        UPDATE GOLDEN_ACCOUNT_D
        SET T3_MASTER_IDENTIFIER = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "INDUSTRY_CODE":
        UPDATE GOLDEN_ACCOUNT_D
        SET INDUSTRY_CODE = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "RESELLER_CODE":
        UPDATE GOLDEN_ACCOUNT_D
        SET CUST_NMBR_AT_DIST = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "COUNTRY":
        SELECT 
            @ERP_COUNTRY_CD = ERP_COUNTRY_CD
            , @REGION_NAME = REGION_NAME
            , @NODE_LEVEL_08_VALUE = NODE_LEVEL_08_VALUE
        FROM COUNTRY_GEO_D
        WHERE COUNTRY_GEO_D.NODE_LEVEL_08_VALUE = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE

        UPDATE GOLDEN_ACCOUNT_D
        SET ERP_COUNTRY_CD = @ERP_COUNTRY_CD
            , REGION = @REGION_NAME
            , COUNTRY = @NODE_LEVEL_08_VALUE
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    case "CHANNEL_GROUPING_PARENT":
        if(@selected_PENDINGAPPROVALATTRIBUTE.LOGITECH_PARTY_ID = "") {
            SELECT @selected_PENDINGAPPROVALATTRIBUTE.LOGITECH_PARTY_ID = CONCAT('P', MAX(TO_NUMBER(TRIM(LEADING 'P' FROM LOGITECH_PARTY_ID))) + 1) 
            FROM GOLDEN_ACCOUNT_D
        }

        UPDATE GOLDEN_ACCOUNT_D
        SET LOGITECH_PARTY_NAME = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
            , LOGITECH_PARTY_ID = @selected_PENDINGAPPROVALATTRIBUTE.LOGITECH_PARTY_ID
        WHERE GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
        AND CURRENT_VERSION_FLAG = "Y"

        break;
    default:
        SELECT
            @GOLDEN_ACCOUNT_ATTR_LOV_PKEY = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_PKEY
            , @GOLDEN_ACCOUNT_ATTR_LOV_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID
            , @GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID
        FROM GOLDEN_ACCOUNT_ATTR_TYPE_D
            LEFT JOIN GOLDEN_ACCOUNT_ATTR_LOV_D
            ON GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID 
            AND GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_VALUE = @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE
        WHERE GOLDEN_ACCOUNT_ATTR_TYPE_D.GOLDEN_ACCOUNT_ATTR_TYPE_NAME = @selected_PENDINGAPPROVALATTRIBUTE.ATTRIBUTE


        if(@GOLDEN_ACCOUNT_ATTR_LOV_PKEY IS NULL) {
            SELECT @max_GOLDEN_ACCOUNT_ATTR_LOV_ID = MAX(GOLDEN_ACCOUNT_ATTR_LOV_ID)
            FROM GOLDEN_ACCOUNT_ATTR_LOV_ID

            INSERT INTO GOLDEN_ACCOUNT_ATTR_LOV_D
            (
                [GOLDEN_ACCOUNT_ATTR_LOV_ID],
                [GOLDEN_ACCOUNT_ATTR_TYPE_ID],
                [GOLDEN_ACCOUNT_ATTR_VALUE],
                [EFF_START_DATE],
                [EFF_END_DATE],
                [CREATED_BY],
                [CREATED_DATE],
                [CHANGE_SUBMITTED_BY],
                [CHANGE_SUBMITTED_DATE],
                [CHANGE_APPROVED_BY],
                [CHANGE_APPROVED_DATE],
                [CURRENT_VERSION_FLAG],
                [CHANGE_SUBMITTED_COMMENTS],
                [CHANGE_APPROVAL_COMMENTS]
            )
            VALUES
            (
                @max_GOLDEN_ACCOUNT_ATTR_LOV_ID + 1,
                @GOLDEN_ACCOUNT_ATTR_TYPE_ID,
                @selected_PENDINGAPPROVALATTRIBUTE.NEWVALUE,
                @selected_PENDINGAPPROVALATTRIBUTE.STARTDATE,
                @selected_PENDINGAPPROVALATTRIBUTE.ENDDATE,
                @currentUserName,
                SYSDATE,
                @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY,
                @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE,
                @currentUserName,
                SYSDATE,
                "Y",
                @selected_PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT
                @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT
            )
        }


        SELECT 
            @GOLDEN_ACC_ATTR_BDGE_PKEY = GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACC_ATTR_BDGE_PKEY
        FROM GOLDEN_ACCOUNT_ATTR_BRIDGE
            INNER JOIN GOLDEN_ACCOUNT_ATTR_LOV_D
            ON GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ATTR_LOV_ID = GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_LOV_ID 
            AND GOLDEN_ACCOUNT_ATTR_BRIDGE.CURRENT_VERSION_FLAG = "Y" 
            AND GOLDEN_ACCOUNT_ATTR_LOV_D.CURRENT_VERSION_FLAG = "Y"
        WHERE GOLDEN_ACCOUNT_ATTR_LOV_D.GOLDEN_ACCOUNT_ATTR_TYPE_ID = @GOLDEN_ACCOUNT_ATTR_TYPE_ID
        AND GOLDEN_ACCOUNT_ATTR_BRIDGE.GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID

        UPDATE GOLDEN_ACCOUNT_ATTR_BRIDGE
        SET GOLDEN_ACCOUNT_ID = @selected_GOLDEN_ACCOUNT_ID
            , GOLDEN_ACCOUNT_ATTR_LOV_ID = @GOLDEN_ACCOUNT_ATTR_LOV_ID
            , EFF_START_DATE = @selected_PENDINGAPPROVALATTRIBUTE.STARTDATE
            , EFF_END_DATE = @selected_PENDINGAPPROVALATTRIBUTE.ENDDATE
            , CREATED_BY = @currentUserName
            , CREATED_DATE = GETDATE()
            , CHANGE_SUBMITTED_BY = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY
            , CHANGE_SUBMITTED_DATE = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE
            , CHANGE_APPROVED_BY = GETDATE()
            , CHANGE_SUBMITTED_COMMENTS = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT
            , CHANGE_APPROVAL_COMMENTS = @selected_PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT
        WHERE GOLDEN_ACC_ATTR_BDGE_PKEY = @GOLDEN_ACC_ATTR_BDGE_PKEY

        break;
}

UPDATE GOLDEN_ACCOUNT_D
SET EFF_START_DATE = @selected_PENDINGAPPROVALATTRIBUTE.STARTDATE
    , EFF_END_DATE = @selected_PENDINGAPPROVALATTRIBUTE.ENDDATE
    , CHANGE_SUBMITTED_COMMENTS = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_COMMENT
    , CHANGE_SUBMITTED_BY = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_BY
    , CHANGE_SUBMITTED_DATE = @selected_PENDINGAPPROVALATTRIBUTE.SUBMITTED_DATE
    , CHANGE_APPROVAL_COMMENTS = @selected_PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT
    , CHANGE_APPROVED_BY = @currentUserName
    , CHANGE_APPROVED_DATE = GETDATE()
    , RNK = RNK + 1
    , CREATED_BY = @currentUserName
    , CREATED_DATE = GETDATE()
WHERE GOLDEN_ACCOUNT_ID = @selected_PENDINGAPPROVALATTRIBUTE.GOLDEN_ACCOUNT_ID
AND CURRENT_VERSION_FLAG = "Y"

UPDATE PENDINGAPPROVALATTRIBUTE
SET [ISAPPROVED] = 1, 
    [APPROVED_BY] = @currentUserName,
    [APPROVED_DATE] = SYSDATE,
    [APPROVED_COMMENT] = @selected_PENDINGAPPROVALATTRIBUTE.APPROVED_COMMENT
WHERE [PENDINGAPPROVALATTRIBUTE_PKEY] = @selected_PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY
AND [ATTRIBUTE] = @selected_PENDINGAPPROVALATTRIBUTE.ATTRIBUTE


UPDATE PENDINGAPPROVALATTRIBUTE
SET [ISREJECTED] = 1
WHERE [PENDINGAPPROVALATTRIBUTE_PKEY] = @selected_PENDINGAPPROVALATTRIBUTE.PENDINGAPPROVALATTRIBUTE_PKEY




INSERT INTO PRESENTATION.GOLDEN_ACCOUNT_ATTR_LOV_D 
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
    'LBS',
    current_date(),
    PENDINGAPPROVALFORLOVS.SUBMITTED_BY,
    PENDINGAPPROVALFORLOVS.SUBMITTED_DATE,
    PENDINGAPPROVALFORLOVS.SUBMITTED_COMMENT,
    'LBS',
    current_date(),
    'Y',
    PENDINGAPPROVALFORLOVS.APPROVED_COMMENT
FROM PRESENTATION.PENDINGAPPROVALFORLOVS 
WHERE PENDINGAPPROVALFORLOVS.ISREJECTED = 0 AND PENDINGAPPROVALFORLOVS.ISAPPROVED = 0 
	AND PENDINGAPPROVALFORLOVS.PENDINGAPPROVALFORLOV_PKEY = 102;

