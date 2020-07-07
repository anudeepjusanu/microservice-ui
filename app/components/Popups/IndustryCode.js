import React, { useEffect, useState } from "react";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import TypeAheadDropDown from "components/TypeAheadDropDown";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import {
  getChangeHistory,
  updateAttribute,
} from "services/accountDetailsService";
import { getIndustryMeta } from "services/goldenSearchService";
import { useAlert } from "react-alert";

function IndustryCode(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    industryCode: "",
  });
  const [industry, setIndustry] = useState([]);
  const alert = useAlert();
  const [history, setHistory] = useState([]);
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
    props.closeModal("industryCode");
  };

  const industrySelected = (value) => {
    setAccount({
      ...account,
      industryCode: value,
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
    if(account.industryCode.value !="-"){
        setIsInvalid(false);
    if (account.industryCode.value != props.currentValue) {
      const obj = {
        ATTRIBUTE: "INDUSTRY_CODE",
        GOLDEN_ACCOUNT_ID: props.goldenAccountId,
        CURRENTVALUE: props.currentValue,
        NEWVALUE: account.industryCode,
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: account.comments,
      };
      setDisabled(true);
      updateAttribute(obj).then((res) => {
        if (res && res.data && res.data.status) {
          props.closeModal("industryCode",true);
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
    getChangeHistory(props.goldenAccountId, "INDUSTRY_CODE").then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getIndustryMeta().then((res) => {
      let opt = [];
      if (props.currentValue != "") {
      }
      if (res && res.data && res.data.industryCodes) {
        _.each(res.data.industryCodes, (arr) => {
          if (arr.INDUSTRY_CODE != props.currentValue) {
            opt.push(arr.INDUSTRY_CODE);
          }
        });
      }
      setIndustry(opt);
    });
  }, []);

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Industry Code"}
    >
      <form>
        <FormField>
          <label class="MandatoryLabel">Industry Code</label>
          <TypeAheadDropDown
            placeholder=" Type Industry Code"
            width="250px"
            height="30px"
            //clearText={() => clearField("classification")}
            onSelect={industrySelected}
            items={industry}
            value={account.industryCode}
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
          <ButtonFilled onButtonClick={(e) => updateAccount(e)}  disabled={disabled}>
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

export default IndustryCode;
