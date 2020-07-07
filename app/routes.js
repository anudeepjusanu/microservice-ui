import React from "react";
import { Switch } from "react-router-dom";
import LogitechRoute from "components/LogitechRoute";
import HomePage from "containers/HomePage/Loadable";
import AccountDetails from "containers/AccountDetails/Loadable";
import XrefDetails from "containers/XrefDetails/Loadable";
import XrefSites from "containers/XrefSites/Loadable";
import PendingApprovals from "containers/PendingApprovals/Loadable";
import Reassign from "containers/Reassign/Loadable";
import NewCustomerContact from "containers/NewCustomerContact/Loadable";
import CustomerContactSearch from "containers/CustomerContactSearch";

const routes = (
  <Switch>
    <LogitechRoute exact path="/" component={HomePage} />
    <LogitechRoute
      exact
      path="/Account_details/:goldenAccountId"
      component={AccountDetails}
    />
    <LogitechRoute
      exact
      path="/xref_details/:goldenAccountId/:logitechAccountId"
      component={XrefDetails}
    />
    <LogitechRoute
      exact
      path="/xref_sites/:goldenAccountId/:siteId"
      component={XrefSites}
    />
    <LogitechRoute
      exact
      path="/pendingApprovals/:type"
      component={PendingApprovals}
    />
    <LogitechRoute
      exact
      path="/reassign/:goldenAccountId"
      component={Reassign}
    />
    <LogitechRoute
      exact
      path="/newCustomerContacts/:id"
      component={NewCustomerContact}
    />
    <LogitechRoute
      exact
      path="/CustomerContactSearch/:id"
      component={CustomerContactSearch}
    />
  </Switch>
);
export default routes;
