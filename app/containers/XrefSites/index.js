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
import { getXrefSites } from "services/accountDetailsService";
import history from "utils/history";
import _ from "lodash";

function XrefSites(props) {
  const [accountDetails, setAccountDetails] = useState({});

  useEffect(() => {
    getXrefSites(props.match.params.siteId).then(
      (res) => {
        setAccountDetails(res.data.xrefAccountSite);
      }
    );
  }, []);

  const goBack = () => {
    history.push(`/Account_details/${props.match.params.goldenAccountId}`);
  };
  return (
    <React.Fragment>
      <Container>
        {_.keys(accountDetails).length ? (
          <SearchFormTitle>
            {accountDetails.ACCOUNT_NAME} (
            {accountDetails.ACCOUNT_SITE_USE_ID})
          </SearchFormTitle>
        ) : (
            <SearchFormTitle />
          )}
        <SubTitle>Xref Account Site Details</SubTitle>
        <Article>
          <Section>
            <FormColumn>
              <FormField>
                <Label>Account Site Use Id</Label>
                <Input
                  value={accountDetails.ACCOUNT_SITE_USE_ID || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Account Name</Label>
                <Input
                  value={accountDetails.ACCOUNT_NAME || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Account Number</Label>
                <Input value={accountDetails.ACCOUNT_NUMBER || ""} />
              </FormField>
              <FormField>
                <Label>Address Line 1</Label>
                <Input
                  value={accountDetails.ADDRESS_LINE1 || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Address Line 2</Label>
                <Input value={accountDetails.ADDRESS_LINE2 || ""} />
              </FormField>
              <FormField>
                <Label>Revenue Recognition Country Code</Label>
                <Input
                  value={accountDetails.REV_RECOG_CNTRY_CD || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Sales Channel</Label>
                <Input
                  value={accountDetails.SALES_CHANNEL || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
            </FormColumn>
            <FormColumn>
              <FormField>
                <Label>Account ID</Label>
                <Input value={accountDetails.ACCOUNT_ID || ""} />
              </FormField>
              <FormField>
                <Label>Primary Flag</Label>
                <Input value={accountDetails.PRIMARY_FLAG || ""} />
              </FormField>
              <FormField>
                <Label>Site Use Type</Label>
                <Input
                  value={accountDetails.ACCOUNT_SITE_USE_TYPE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>City</Label>
                <Input
                  value={accountDetails.CITY || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Postal Code</Label>
                <Input
                  value={accountDetails.POSTAL_CD || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Entity</Label>
                <Input
                  value={accountDetails.ENTITY || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Currency</Label>
                <Input value={accountDetails.PROJECT_CODE || ""} />
              </FormField>
            </FormColumn>
            <FormColumn>
              <FormField>
                <Label>Store Name</Label>
                <Input value={accountDetails.STORE_NAME || ""} />
              </FormField>

              <FormField>
                <Label>Source System Reference Type</Label>
                <Input
                  value={accountDetails.SOURCE_SYSTEM_REFERENCE_TYPE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Store Number</Label>
                <Input
                  value={accountDetails.STORE_NUMBER || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>State</Label>
                <Input
                  value={accountDetails.STATE || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Country</Label>
                <Input
                  value={accountDetails.COUNTRY_NAME || ""}
                  showClearIcon={false}
                  showEditIcon={false}
                />
              </FormField>
              <FormField>
                <Label>Revenue Recognition Country Name</Label>
                <Input value={accountDetails.REV_RECOG_CNTRY_NAME || ""} />
              </FormField>
              <FormField>
                <Label>Project Code</Label>
                <Input value={accountDetails.PROJECT_CODE || ""} />
              </FormField>
            </FormColumn>
          </Section>
        </Article>
        <SearchButtons>
          <ButtonOutLine onButtonClick={goBack}>Back</ButtonOutLine>
        </SearchButtons>
      </Container>
    </React.Fragment>
  );
}

export default XrefSites;
