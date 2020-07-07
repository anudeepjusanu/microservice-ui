import React, { useEffect, useState } from "react";
import {
  Section,
  FormColumn,
  FormField,
  Label,
  SearchButtons,
  Article,
  SearchFormTitle,
  SubTitle,
  Container,
} from "./styles";
import Input from "components/Input";
import { ButtonFilled, ButtonOutLine } from "components/Button";
import { getXrefGoldenAccountInfo } from "services/accountDetailsService";
import history from "utils/history";
import _ from "lodash";

import { OwnFlag } from "components/Popups";
function XrefDetails(props) {
  const [accountDetails, setAccountDetails] = useState({});
  const [modelOpen, setModelOpen] = useState({
    ownFlag: false,
  });

  useEffect(() => {
    getXrefGoldenAccountInfo(props.match.params.logitechAccountId).then(
      (res) => {
        setAccountDetails(res.data.xrefGoldenAccount);
      }
    );
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
  };

  const goBack = () => {
    history.push(`/Account_details/${props.match.params.goldenAccountId}`);
  };
  return (
    <React.Fragment>
      <Container>
        {_.keys(accountDetails).length ? (
          <SearchFormTitle>
            {accountDetails.ACCOUNT_NAME} ({accountDetails.LOGITECH_ACCOUNT_ID})
          </SearchFormTitle>
        ) : (
          <SearchFormTitle />
        )}
        <SubTitle>Xref Account Details</SubTitle>
        <Article>
          <Section>
            <FormColumn>
              <FormField>
                <Label>Account Id</Label>
                <Input
                  value={accountDetails.ACCOUNT_ID || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Logitech Account Id</Label>
                <Input
                  value={accountDetails.LOGITECH_ACCOUNT_ID || ""}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Account Name</Label>
                <Input
                  value={accountDetails.ACCOUNT_NAME || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Account Number</Label>
                <Input
                  value={accountDetails.ACCOUNT_NUMBER || ""}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Party</Label>
                <Input
                  value={accountDetails.PARTY_ID || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Party Name</Label>
                <Input value={accountDetails.PARTY_NAME || ""} width="200px" />
              </FormField>
              <FormField>
                <Label>Account Tier</Label>
                <Input
                  value={accountDetails.ACCOUNT_TIER || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Master Name</Label>
                <Input
                  value={accountDetails.MASTER_NAME || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
            </FormColumn>
            <FormColumn>
              <FormField>
                <Label>Account Status</Label>
                <Input
                  value={accountDetails.ACCOUNT_STATUS || ""}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Zyme Id</Label>
                <Input value={accountDetails.ZYME_ID || ""} width="200px" />
              </FormField>
              <FormField>
                <Label>Valid Zyme Id</Label>
                <Input
                  value={accountDetails.VALID_ZYME_ID || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Valid Zyme Business Name</Label>
                <Input
                  value={accountDetails.VALID_ZYME_BUSINESS_NAME || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Channel Position</Label>
                <Input
                  value={accountDetails.CHANNEL_POSITION || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Country</Label>
                <Input
                  value={accountDetails.COUNTRY || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Region</Label>
                <Input value={accountDetails.REGION || ""} width="200px" />
              </FormField>
              <FormField>
                <Label>T3 Master Identifier</Label>
                <Input
                  value={accountDetails.T3_MASTER_IDENTIFIER || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
            </FormColumn>
            <FormColumn>
              <FormField>
                <Label>ERP Country Code</Label>
                <Input
                  value={accountDetails.ERP_COUNTRY_CD || ""}
                  width="200px"
                />
              </FormField>

              <FormField>
                <Label>Geo Key</Label>
                <Input
                  value={accountDetails.GEO_KEY || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Customer Class Code</Label>
                <Input
                  value={accountDetails.CUSTOMER_CLASS_CODE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Source System Reference Type</Label>
                <Input
                  value={accountDetails.SOURCE_SYSTEM_REFERENCE_TYPE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Source System Reference</Label>
                <Input
                  value={accountDetails.SOURCE_SYSTEM_REFERENCE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Source System Name</Label>
                <Input
                  value={accountDetails.SOURCE_SYSTEM_NAME || ""}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Create Its Own Golden</Label>
                <Input
                  value={accountDetails.CREATE_ITS_OWN_GOLDEN_FLAG || ""}
                  Edit={() => {
                    edit("ownFlag");
                  }}
                  showEditIcon={true}
                  width="200px"
                />
              </FormField>
              <FormField>
                <Label>Industry Code</Label>
                <Input
                  value={accountDetails.INDUSTRY_CODE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                  width="200px"
                />
              </FormField>
            </FormColumn>
          </Section>
        </Article>
        <SearchButtons>
          <ButtonOutLine onButtonClick={goBack}>Back</ButtonOutLine>
        </SearchButtons>
      </Container>
      {modelOpen.ownFlag && (
        <OwnFlag
          modelOpen={modelOpen.ownFlag}
          closeModal={closeModal}
          accountName={accountDetails.ACCOUNT_NAME || ""}
          accountId={accountDetails.ACCOUNT_ID || ""}
          goldenAccountId={props.match.params.goldenAccountId}
          currentValue={accountDetails.CREATE_ITS_OWN_GOLDEN_FLAG || ""}
        />
      )}
    </React.Fragment>
  );
}

export default XrefDetails;
