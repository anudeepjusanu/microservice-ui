import React, { useEffect, memo, useState } from "react";
import {
  Article,
  Title,
  ButtonCollection,
  LoadingButton,
} from "./PendingApprovalStyles";
import { ButtonFilled, ButtonReject } from "./../../components/Button";
import AttributeTable from "./attributeItems";
import LovsTable from "./lovsItems";
import OwnFlagsTable from "./OwnFlagsItems";
import {
  approveItems,
  rejectItems,
} from "../../services/pendingApprovalService";
import ContactsTable from "./ContactsItems";
import XRefGroupingTable from "./XRefGroupingItems";
import _ from "lodash";
import { useAlert } from "react-alert";

function PendingApprovals(props) {
  const [selectedAttribute, setSelectedAttributes] = useState([]);
  const [loadApi, setLoadApi] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const alert = useAlert();

  const rejectItem = () => {
    console.log('aaaa')
    setShowLoading(true);
    if (!showLoading) {
      let selectedArr = {
        PKEYS: [],
        APPROVED_COMMENT: "",
      };
      switch (props.match.params.type) {
        case "Attributes":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALATTRIBUTE_PKEY);
          });
          break;
        case "LOVs":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALFORLOV_PKEY);
          });
          break;
        case "XRefGrouping":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALXREFACCT_PKEY);
          });
          break;
      }
      rejectItems(selectedArr, props.match.params.type).then((res) => {
        alert.success("Rejected Successfully");
        setSelectedAttributes([]);
        setShowLoading(false);
        setLoadApi(true);
        setLoadApi(false);
      });
    } else {
      alert.error("Please wait rejection in progress");
    }
  }
  const approveItem = () => {
    setShowLoading(true);
    if (!showLoading) {
      let selectedArr = {
        PKEYS: [],
        APPROVED_COMMENT: "",
      };
      switch (props.match.params.type) {
        case "Attributes":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALATTRIBUTE_PKEY);
          });
          break;
        case "LOVs":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALFORLOV_PKEY);
          });
          break;
        case "XRefGrouping":
          _.each(selectedAttribute, (attr) => {
            selectedArr.PKEYS.push(attr.PENDINGAPPROVALXREFACCT_PKEY);
          });
          break;
      }
      approveItems(selectedArr, props.match.params.type).then((res) => {
        alert.success("Approved Successfully");
        setSelectedAttributes([]);
        setShowLoading(false);
        setLoadApi(true);
        setLoadApi(false);
      });
    } else {
      alert.error("Please wait approval in progress");
    }
  };

  const setSelectedItems = (items) => {
    setSelectedAttributes(items);
  };

  return (
    <Article>
      {showLoading && <LoadingButton>Loading...</LoadingButton>}
      <Title> Pending Approval- {props.match.params.type} </Title>
      <hr />
      <ButtonCollection>
        <ButtonFilled disabled={!selectedAttribute.length} onButtonClick={() => approveItem()}>
          Approve selected
        </ButtonFilled>
        <ButtonReject disabled={!selectedAttribute.length} onButtonClick={rejectItem}>Reject selected</ButtonReject>
      </ButtonCollection>
      {props.match.params.type == "Attributes" && (
        <AttributeTable
          selectedAttributes={(items) => setSelectedItems(items)}
          loadApi={loadApi}
        />
      )}
      {props.match.params.type == "LOVs" && (
        <LovsTable
          selectedAttributes={(items) => setSelectedItems(items)}
          loadApi={loadApi}
        />
      )}
      {props.match.params.type == "OwnFlags" && (
        <OwnFlagsTable
          selectedAttributes={(items) => setSelectedItems(items)}
        />
      )}
      {props.match.params.type == "XRefGrouping" && (
        <XRefGroupingTable
          selectedAttributes={(items) => setSelectedItems(items)}
        />
      )}
      {props.match.params.type == "Contacts" && (
        <ContactsTable
          selectedAttributes={(items) => setSelectedItems(items)}
        />
      )}
    </Article>
  );
}

export default PendingApprovals
