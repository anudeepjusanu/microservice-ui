import React, { useEffect, useState } from "react";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import SelectBox from "components/Select";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import {
  getChangeHistory,
  getAttributes,
  updateAttribute,
} from "services/accountDetailsService";
import { useAlert } from "react-alert";

function MasterName(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    masterName: {
      label: props.currentValue || "-",
      value: props.currentValue || "-",
    },
  });
  const alert = useAlert();
  const [history, setHistory] = useState([]);
  const [options, setOptions] = useState([
    {
      label: props.currentValue || "-",
      value: props.currentValue || "-",
    },
  ]);
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
    props.closeModal("masterName");
  };

  const _onSelect = (event) => {
    setAccount({
      ...account,
      masterName: event,
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
    if (account.masterName.value != "-") {
      setIsInvalid(false);
      const obj = {
        ATTRIBUTE: "MASTER_NAME",
        GOLDEN_ACCOUNT_ID: props.goldenAccountId,
        CURRENTVALUE: props.currentValue,
        NEWVALUE: account.masterName.value,
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: account.comments,
      };
      setDisabled(true);
      updateAttribute(obj).then((res) => {
        if (res && res.data && res.data.status) {
          props.closeModal("masterName",true);
        }
        alert.success("Change request sent for approval");
        setDisabled(false);
      });
    } else {
      alert.error("Please select new value");
      console.log("Please select a value");
      setIsInvalid(true);
    }

    //Connect to API if value is not empty
  };

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, "MASTER_NAME").then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getAttributes(props.goldenAccountId, "MASTER_NAME").then((res) => {
      let opt = [
        {
          label: "-",
          value: "-",
        },
      ];
      if (props.currentValue != "") {
        opt.push({
          label: props.currentValue,
          value: props.currentValue,
        });
      }
      if (res && res.data && res.data.data) {
        _.each(res.data.data, (arr) => {
          if (arr.MASTER_NAME != props.currentValue) {
            opt.push({
              label: arr.MASTER_NAME,
              value: arr.MASTER_NAME,
            });
          }
        });
      }
      setOptions(opt);
    });
  }, []);

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Master Name"}
    >
      <form>
        <FormField>
          <label class="MandatoryLabel">Master Name</label>
          <SelectBox
            data={options}
            onSelect={_onSelect}
            defaultOption={account.masterName}
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
            onButtonClick={(e) => {
              updateAccount(e);
            }} disabled={disabled}
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

export default MasterName;
