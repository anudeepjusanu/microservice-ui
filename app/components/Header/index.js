import React, { useState, useImperativeHandle, forwardRef } from "react";
import "./HeaderStyes.js";
import NavBar from "./NavBar";
import HeaderLink from "./HeaderLink";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSortDown } from "@fortawesome/free-solid-svg-icons";
import {
  HeaderContainer,
  TitleContainer,
  Title,
  Count,
  User,
  PendingApprovalList,
  Name,
  Number,
  Item,
} from "./HeaderStyes";
import Img from "./Img";
import Logo from "images/logo.png";
import history from "utils/history";

const Header = forwardRef((props, ref) => {
  const [showPendingApprovals, fnshowPendingApprovals] = useState(false);

  const pendingApprovals = () => {
    fnshowPendingApprovals(!showPendingApprovals);
  }

  const pendingApprovalSelected = (selected) => {
    history.push(`/pendingApprovals/${selected}`);
  };

  useImperativeHandle(ref, () => ({
     pendingApprovals () {
      fnshowPendingApprovals(false);
    }
  }));

  return (
    <HeaderContainer>
      <TitleContainer>
        <div>
          <Img src={Logo} alt="react-boilerplate - Logo" />
        </div>
        <Title>Customer MDM</Title>
        <div className="tooltipstered balloon">
          <FontAwesomeIcon icon={faUser} />
          <User>Arun Kola</User>
        </div>
      </TitleContainer>
      <NavBar>
        <HeaderLink to="/">Golden Account Search</HeaderLink>
        <HeaderLink onClick={pendingApprovals}>
          Pending Approval
          <Count>
            {" "}
            (2) <FontAwesomeIcon icon={faSortDown} />
          </Count>
          {showPendingApprovals && (
            <PendingApprovalList>
              <Item onClick={() => pendingApprovalSelected("Attributes")}>
                <Name>Pending Approval - Attributes</Name>
                <Number>(0)</Number>
              </Item>
              <Item onClick={() => pendingApprovalSelected("LOVs")}>
                <Name>Pending Approval -LOVs</Name>
                <Number>(0)</Number>
              </Item>
              <Item onClick={() => pendingApprovalSelected("OwnFlags")}>
                <Name>Pending Approval -Own Flags</Name>
                <Number>(0)</Number>
              </Item>
              <Item onClick={() => pendingApprovalSelected("XRefGrouping")}>
                <Name>Pending Approval-XRef Grouping</Name>
                <Number>(0)</Number>
              </Item>
              <Item onClick={() => pendingApprovalSelected("Contacts")}>
                <Name>Pending Approval-Contacts</Name>
                <Number>(0)</Number>
              </Item>
            </PendingApprovalList>
          )}
        </HeaderLink>
        <HeaderLink to="/">Error Log</HeaderLink>
      </NavBar>
    </HeaderContainer>
  );
});

export default Header;
