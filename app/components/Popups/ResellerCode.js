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

function ResellerCode(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    resellerCode: {
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
    props.closeModal("resellerCode");
  };

  const _onSelect = (event) => {
    setAccount({
      ...account,
      resellerCode: event,
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
    if (account.resellerCode.value !="-"){
     setIsInvalid(false);
    if (account.resellerCode.value != props.currentValue) {
      const obj = {
        ATTRIBUTE: "CUST_NMBR_AT_DIST",
        GOLDEN_ACCOUNT_ID: props.goldenAccountId,
        CURRENTVALUE: props.currentValue,
        NEWVALUE: account.resellerCode.value,
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: account.comments,
      };
      setDisabled(true);
      updateAttribute(obj).then((res) => {
        if (res && res.data  && res.data.status) {
          props.closeModal("resellerCode",true);
        }
        alert.success("Change request sent for approval");
        setDisabled(false);
      });
    } else {
      alert.error("Please select new value");
      console.log("Please select a value");
    }
  }else{
    setIsInvalid(true);
  }

    //Connect to API if value is not empty
  };

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, "CUST_NMBR_AT_DIST").then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getAttributes(props.goldenAccountId, "CUST_NMBR_AT_DIST").then((res) => {
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
          if (arr.CUST_NMBR_AT_DIST != props.currentValue) {
            opt.push({
              label: arr.CUST_NMBR_AT_DIST,
              value: arr.CUST_NMBR_AT_DIST,
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
      title={"Edit Reseller Code"}
    >
      <form>
        <FormField>
          <label class="MandatoryLabel">Reseller Code</label>
          <SelectBox
            data={options}
            onSelect={_onSelect}
            defaultOption={account.resellerCode}
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
            }}disabled={disabled}
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

export default ResellerCode;
