import React, { useEffect, memo, useState } from "react";
import {
  Article,
  ExportToExcel,
  Div,
  LoadingButton,
} from "./AccountDetailsStyles";
import AccountDetailsForm from "components/AccountDetailsForm";
import LogitechTab from "components/Tabs";
import { TabHeadings } from "components/AccountDetailsTabs";
import { ButtonFilled } from "./../../components/Button";
import RecentChanges from "./RecentChanges";
import XrefSites from "./XrefSites";
import AccountClasification from "./AccountClasification";
import Reporting from "./Reporting";
import Contacts from "./Contacts";
import XrefAccount from "./XrefAccount";

function AccountDetails(props) {
  useEffect(() => {}, []);

  const TabContent = [
    <div>
      <RecentChanges goldenAccountId={props.match.params.goldenAccountId} />
    </div>,
    <div>
      <XrefAccount goldenAccountId={props.match.params.goldenAccountId} />
    </div>,
    <div>
      <XrefSites goldenAccountId={props.match.params.goldenAccountId} />
    </div>,
    <div>
      <AccountClasification
        goldenAccountId={props.match.params.goldenAccountId}
      />
    </div>,
    <div>
      <Reporting goldenAccountId={props.match.params.goldenAccountId} />
    </div>,
    <div>
      <Contacts goldenAccountId={props.match.params.goldenAccountId} />
    </div>,
  ];

  return (
    <Article>
      <AccountDetailsForm
        FormDetails={props.location.state}
        goldenAccountId={props.match.params.goldenAccountId}
      />
      {/* <ButtonFilled>ADD NEW CONTACT</ButtonFilled> */}
      <LogitechTab TabHeading={TabHeadings} TabBody={TabContent} />
    </Article>
  );
}

export default AccountDetails;
