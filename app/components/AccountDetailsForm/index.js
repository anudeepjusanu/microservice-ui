import React, { useEffect, useState } from "react";
import {
  Section,
  FormColumn,
  FormField,
  SearchButtons,
  Article,
  SearchFormTitle,
  SubTitle,
  LoadingButton,
} from "./AccountDetailsStyles";
import Input from "../Input";
import _ from "lodash";
import "./style.css";
import { getAccountDetails } from "services/accountDetailsService";
import {
  AccountNumber,
  AccountName,
  Country,
  Accural,
  T3Master,
  ZymeId,
  ZymeBusiness,
  MasterName,
  ExcludeGrouping,
  GroupingParent,
  IndustryCode,
  ResellerCode,
  StrategicImportance,
  TransactionType,
  ChannelPosition,
} from "components/Popups";

function AccountDetailsForm(props) {
  const [accountDetails, setAccountDetails] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const [modelOpen, setModelOpen] = useState({
    accountNumber: false,
    accountName: false,
    country: false,
    accural: false,
    t3Master: false,
    zymeId: false,
    zymeBusinessName: false,
    masterName: false,
    excludeGrouping: false,
    groupingParent: false,
    industryCode: false,
    resellerCode: false,
    strategicImportance: false,
    transactionType: false,
    channelPosition: false,
  });
  const clearField = (key) => {};

  const loadDetails = () => {
    setShowLoading(true);
    getAccountDetails(props.goldenAccountId).then((res) => {
      setAccountDetails(res.data.goldenAccount);
      setShowLoading(false);
    });
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const edit = (name) => {
    setModelOpen({
      ...modelOpen,
      [name]: true,
    });
  };

  const closeModal = (name, isReload) => {
    setModelOpen({
      ...modelOpen,
      [name]: false,
    });
    if (isReload) {
      loadDetails();
    }
  };

  return (
    <React.Fragment>
      {showLoading && <LoadingButton>Loading...</LoadingButton>}
      {_.keys(accountDetails).length ? (
        <SearchFormTitle>
          {accountDetails.GOLDEN_ACCOUNT_NAME} (
          {accountDetails.LOGITECH_ACCOUNT_ID})
        </SearchFormTitle>
      ) : (
        <SearchFormTitle />
      )}
      <SubTitle>Account Details</SubTitle>
      <Article>
        <Section>
          <FormColumn>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_ACCOUNT_NUMBER === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label className="row1">Account Number</label>
              <Input
                value={accountDetails.ACCOUNT_NUMBER || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_ACCOUNT_NUMBER === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_ACCOUNT_NUMBER === 1 ? true : false
                }
                Edit={() => {
                  edit("accountNumber");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_ACCOUNT_NAME === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label className="row1">Account Name</label>
              <Input
                value={accountDetails.GOLDEN_ACCOUNT_NAME || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_ACCOUNT_NAME === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_ACCOUNT_NAME === 1 ? true : false
                }
                Edit={() => {
                  edit("accountName");
                }}
                width="210px"
              />
            </FormField>
            <FormField>
              <label className="row1">Logitech Account Id</label>
              <Input
                value={accountDetails.LOGITECH_ACCOUNT_ID || ""}
                readOnly={true}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_COUNTRY === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label className="row1">Country</label>
              <Input
                value={accountDetails.COUNTRY || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={accountDetails.CAN_EDIT_COUNTRY === 1 ? false : true}
                showEditIcon={
                  accountDetails.CAN_EDIT_COUNTRY === 1 ? true : false
                }
                Edit={() => {
                  edit("country");
                }}
                width="210px"
              />
            </FormField>
            <FormField>
              <label className="row1">Region</label>
              <Input
                value={accountDetails.REGION || ""}
                readOnly={true}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_ACCRUAL === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label className="row1">Accrual</label>
              <Input
                value={accountDetails.ACCRUAL || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={accountDetails.CAN_EDIT_ACCRUAL === 1 ? false : true}
                showEditIcon={
                  accountDetails.CAN_EDIT_ACCRUAL === 1 ? true : false
                }
                Edit={() => {
                  edit("accural");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_T3_MASTER_IDENTIFIER === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label className="row1">T3 Master Identifier</label>
              <Input
                value={accountDetails.T3_MASTER_IDENTIFIER || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_T3_MASTER_IDENTIFIER === 1
                    ? false
                    : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_T3_MASTER_IDENTIFIER === 1
                    ? true
                    : false
                }
                Edit={() => {
                  edit("t3Master");
                }}
                width="210px"
              />
            </FormField>
          </FormColumn>
          <FormColumn>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_VALID_ZYME_ID === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label>Valid Zyme Id</label>
              <Input
                value={accountDetails.VALID_ZYME_ID || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_VALID_ZYME_ID === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_VALID_ZYME_ID === 1 ? true : false
                }
                Edit={() => {
                  edit("zymeId");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_VALID_ZYME_BUSINESS_NAME === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label>Valid Zyme Business Name</label>
              <Input
                value={accountDetails.VALID_ZYME_BUSINESS_NAME || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_VALID_ZYME_BUSINESS_NAME === 1
                    ? false
                    : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_VALID_ZYME_BUSINESS_NAME === 1
                    ? true
                    : false
                }
                Edit={() => {
                  edit("zymeBusinessName");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_MASTER_NAME === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label>Master Name</label>
              <Input
                value={accountDetails.MASTER_NAME || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_MASTER_NAME === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_MASTER_NAME === 1 ? true : false
                }
                Edit={() => {
                  edit("masterName");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_EXCLUDE_MATCH_FLAG === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label>Exclude From Grouping</label>
              <Input
                value={accountDetails.EXCLUDE_MATCH_FLAG || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_EXCLUDE_MATCH_FLAG === 1
                    ? false
                    : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_EXCLUDE_MATCH_FLAG === 1
                    ? true
                    : false
                }
                Edit={() => {
                  edit("excludeGrouping");
                }}
                width="210px"
              />
            </FormField>
            <FormField className={"isDisabled"}>
              <label>Project Code</label>
              <Input
                value={accountDetails.PROJECT_CODE || ""}
                readOnly={true}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_CUST_NMBR_AT_DIST === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label>Reseller Code</label>
              <Input
                value={accountDetails.CUST_NMBR_AT_DIST || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_CUST_NMBR_AT_DIST === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_CUST_NMBR_AT_DIST === 1 ? true : false
                }
                Edit={() => {
                  edit("resellerCode");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_INDUSTRY_CODE === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label>Industry Code</label>
              <Input
                value={accountDetails.INDUSTRY_CODE || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_INDUSTRY_CODE === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_INDUSTRY_CODE === 1 ? true : false
                }
                Edit={() => {
                  edit("industryCode");
                }}
                width="210px"
              />
            </FormField>
          </FormColumn>
          <FormColumn className="colmn-3">
            <FormField>
              <label>Tier</label>
              <Input
                value={accountDetails.TIER || ""}
                readOnly={true}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_LOGITECH_PARTY_NAME === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label>Channel Grouping Parent</label>
              <Input
                value={accountDetails.LOGITECH_PARTY_NAME || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_LOGITECH_PARTY_NAME === 1
                    ? false
                    : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_LOGITECH_PARTY_NAME === 1
                    ? true
                    : false
                }
                Edit={() => {
                  edit("groupingParent");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_TRANSACTION_TYPE === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label>Transaction Type</label>
              <Input
                value={accountDetails.TRANSACTION_TYPE || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_TRANSACTION_TYPE === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_TRANSACTION_TYPE === 1 ? true : false
                }
                Edit={() => {
                  edit("transactionType");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_STRATEGIC_IMPORTANCE === 1
                    ? ""
                    : "isDisabled"
                  : ""
              }
            >
              <label>Strategic Importance</label>
              <Input
                value={accountDetails.STRATEGIC_IMPORTANCE || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_STRATEGIC_IMPORTANCE === 1
                    ? false
                    : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_STRATEGIC_IMPORTANCE === 1
                    ? true
                    : false
                }
                Edit={() => {
                  edit("strategicImportance");
                }}
                width="210px"
              />
            </FormField>
            <FormField
              className={
                _.keys(accountDetails).length
                  ? accountDetails.CAN_EDIT_CHANNEL_POSITION === 0
                    ? "isDisabled"
                    : ""
                  : ""
              }
            >
              <label>Channel Position</label>
              <Input
                value={accountDetails.CHANNEL_POSITION || ""}
                readOnly={true}
                showClearIcon={false}
                disabled={
                  accountDetails.CAN_EDIT_CHANNEL_POSITION === 1 ? false : true
                }
                showEditIcon={
                  accountDetails.CAN_EDIT_CHANNEL_POSITION === 1 ? true : false
                }
                Edit={() => {
                  edit("channelPosition");
                }}
                width="210px"
              />
            </FormField>
            <FormField>
              <label>Party ID</label>
              <Input
                value={accountDetails.LOGITECH_PARTY_ID || ""}
                readOnly={true}
                width="210px"
              />
            </FormField>
          </FormColumn>
        </Section>
        <SearchButtons />
        {modelOpen.accountNumber && (
          <AccountNumber
            modelOpen={modelOpen.accountNumber}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.ACCOUNT_NUMBER || ""}
          />
        )}
        {modelOpen.accountName && (
          <AccountName
            modelOpen={modelOpen.accountName}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.GOLDEN_ACCOUNT_NAME || ""}
          />
        )}
        {modelOpen.country && (
          <Country
            modelOpen={modelOpen.country}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.COUNTRY || ""}
          />
        )}
        {modelOpen.accural && (
          <Accural
            modelOpen={modelOpen.accural}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.ACCRUAL || ""}
          />
        )}
        {modelOpen.t3Master && (
          <T3Master
            modelOpen={modelOpen.t3Master}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.T3_MASTER_IDENTIFIER || ""}
          />
        )}
        {modelOpen.zymeId && (
          <ZymeId
            modelOpen={modelOpen.zymeId}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.VALID_ZYME_ID || ""}
          />
        )}
        {modelOpen.zymeBusinessName && (
          <ZymeBusiness
            modelOpen={modelOpen.zymeBusinessName}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.VALID_ZYME_BUSINESS_NAME || ""}
          />
        )}
        {modelOpen.masterName && (
          <MasterName
            modelOpen={modelOpen.masterName}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.MASTER_NAME || ""}
          />
        )}
        {modelOpen.excludeGrouping && (
          <ExcludeGrouping
            modelOpen={modelOpen.excludeGrouping}
            closeModal={closeModal}
            accountName={accountDetails.GOLDEN_ACCOUNT_NAME || ""}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.EXCLUDE_MATCH_FLAG || ""}
          />
        )}

        {modelOpen.groupingParent && (
          <GroupingParent
            modelOpen={modelOpen.groupingParent}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.LOGITECH_PARTY_NAME || ""}
          />
        )}
        {modelOpen.industryCode && (
          <IndustryCode
            modelOpen={modelOpen.industryCode}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.INDUSTRY_CODE || ""}
          />
        )}
        {modelOpen.resellerCode && (
          <ResellerCode
            modelOpen={modelOpen.resellerCode}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.CUST_NMBR_AT_DIST || ""}
          />
        )}
        {modelOpen.strategicImportance && (
          <StrategicImportance
            modelOpen={modelOpen.strategicImportance}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.STRATEGIC_IMPORTANCE || ""}
          />
        )}
        {modelOpen.transactionType && (
          <TransactionType
            modelOpen={modelOpen.transactionType}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.TRANSACTION_TYPE || ""}
          />
        )}
        {modelOpen.channelPosition && (
          <ChannelPosition
            modelOpen={modelOpen.channelPosition}
            closeModal={closeModal}
            goldenAccountId={props.goldenAccountId}
            currentValue={accountDetails.CHANNEL_POSITION || ""}
          />
        )}
      </Article>
    </React.Fragment>
  );
}

export default AccountDetailsForm;
