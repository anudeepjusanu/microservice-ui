import React, { useEffect, useState } from "react";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import SelectBox from "components/Select";
import Input from "../Input";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import {
  getChangeHistory,
  getAttributes,
  updateOwnFlag,
} from "services/accountDetailsService";
import { useAlert } from "react-alert";

function OwnFlag(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    ownGolden: {
      label: props.currentValue || "-",
      value: props.currentValue || "-",
    },
  });
  const alert = useAlert();
  const [history, setHistory] = useState([]);
  const options = [
    {
      label: "-",
      value: "-",
    },
    {
      label: "Yes",
      label: "Yes",
    },
    {
      label: "No",
      label: "No",
    },
  ];
  const columns = [
    {
      Header: "Current value",
      accessor: "ATTRIBUTE",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "New Value",
      accessor: "CURRENTVALUE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Start Date",
      accessor: "PREVIOUSVALUE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "End Date",
      accessor: "SUBMITTED_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Submitted By",
      accessor: "SUBMITTED_BY",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Approved By",
      accessor: "APPROVED_BY",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Approved Date",
      accessor: "APPROVED_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
  ];
  const closePopup = () => {
    props.closeModal("ownFlag");
  };

  const _onSelect = (event) => {
    setAccount({
      ...account,
      ownGolden: event,
    });
  };

  const changeComments = (value) => {
    setAccount({
      ...account,
      comments: value,
    });
  };

  const updateAccount = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (account.ownGolden.value != "-") {
      setIsInvalid(false);
      if (account.ownGolden.value != props.currentValue) {
        const obj = {
          ACCOUNT_ID: props.accountId,
          CURRENTVALUE: props.currentValue,
          NEWVALUE: account.ownGolden.value,
          SUBMITTED_BY: "SUPERADMIN",
          SUBMITTED_COMMENT: account.comments,
        };
        setDisabled(true);
        updateOwnFlag(obj).then((res) => {
          if (res && res.data && res.data.status) {
            props.closeModal("ownFlag", true);
          }
          alert.success("Change request sent for approval");
          setDisabled(false);
        });
      } else {
        alert.error("Please select new value");
        console.log("Please select a value");
      }
    } else {
      setIsInvalid(true);
    }

    //Connect to API if value is not empty
  };

  useEffect(() => {
    // getChangeHistory(props.goldenAccountId, "EXCLUDE_MATCH_FLAG").then(
    //   (res) => {
    //     if (res && res.data && res.data.data) {
    //       setHistory(res.data.data);
    //     }
    //   }
    // );
  }, []);
  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit create its own flag"}
    >
      <form>
        <FormField>
          <label>Account Name</label>
          <Input width="250px" value={props.accountName} disabled={true} />
        </FormField>
        <FormField>
          <label class="MandatoryLabel">Create its Own Golden</label>
          <SelectBox
            data={options}
            onSelect={_onSelect}
            defaultOption={account.ownGolden || ""}
          />
        </FormField>
        <FormField>
          <label>Comments</label>
          <TextArea
            value={account.comments}
            cols={38}
            rows={5}
            changeFunc={changeComments}
          />
        </FormField>
        {isInvalid && (
          <span className="ValidationMessage">
            Please select atleast one value
          </span>
        )}
        <SearchButtons>
          <ButtonFilled
            onButtonClick={(e) => updateAccount(e)}
            disabled={disabled}
          >
            Update
          </ButtonFilled>
          <ButtonOutLine onButtonClick={closePopup}>Cancel</ButtonOutLine>
        </SearchButtons>
      </form>
      <h1>Change History</h1>
      <TableWithPagination
        columns={columns}
        data={history}
        showPagination={false}
        noDataText={"No Items to Show..."}
        customCls="height200"
      />
    </Model>
  );
}

export default OwnFlag;
