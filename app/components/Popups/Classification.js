import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import Input from "../Input";
import TypeAheadDropDown from "components/TypeAheadDropDown";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import {
  getChangeHistory,
  updateAttribute,
  addLovValue,
} from "services/accountDetailsService";
import { getAttributeMeta } from "services/goldenSearchService";
import DatePicker from "./../Datepicker";
import "./styles.css";
import { useAlert } from "react-alert";

function Classification(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    classification: props.currentValue || "",
    startDate: format(new Date("1900-01-01"), "MM-dd-yyyy"),
    endDate: format(new Date("2100-12-31"), "MM-dd-yyyy"),
    attributeType: props.attributeType,
  });
  const alert = useAlert();
  const [history, setHistory] = useState([]);
  const [classification, setClassification] = useState([]);
  const [addForm, setAddForm] = useState(false);
  const [newValue, setNewValue] = useState({
    classification: "",
    comments: "",
    startDate: format(new Date("1900-01-01"), "MM-dd-yyyy"),
    endDate: format(new Date("2100-12-31"), "MM-dd-yyyy"),
  });

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
    props.closeModal("classification");
  };

  const selected = (value) => {
    setAccount({
      ...account,
      classification: value,
    });
  };

  const changeAccountDate = (value, key) => {
    setAccount({
      ...account,
      [key]: value,
    });
  };

  const changeValueDate = (value, key) => {
    setNewValue({
      ...newValue,
      [key]: value,
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
    if (account.classification.value != "-") {
      setIsInvalid(false);
      if (account.classification.value != props.currentValue) {
        const obj = {
          ATTRIBUTE: props.attributeType,
          GOLDEN_ACCOUNT_ID: props.goldenAccountId,
          CURRENTVALUE: props.currentValue,
          NEWVALUE: account.classification,
          SUBMITTED_BY: "Anudeep",
          SUBMITTED_COMMENT: account.comments,
        };
        setDisabled(true);
        updateAttribute(obj).then((res) => {
          if (res && res.data && res.data.status) {
            props.closeModal("classification", true);
          }
          alert.success("Change request sent for approval");
          setDisabled(false);
        });
      } else {
        alert.error("Please select new value");
      }
    } else {
      setIsInvalid(true);
    }

    //Connect to API if value is not empty
  };

  const setClassificationValue = (key, value) => {
    setNewValue({
      ...newValue,
      [key]: value,
    });
  };

  const addValue = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newValue.classification != "") {
      const obj = {
        GOLDEN_ACCOUNT_ATTR_TYPE_NAME: props.attributeType,
        NEWVALUE: newValue.classification,
        STARTDATE: "1900-01-01",
        ENDDATE: "2100-12-31",
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: newValue.comments,
      };
      addLovValue(obj).then((res) => {
        console.log(res);
        if (res && res.data && res.data.data) {
          closePopup();
        }
      });
    } else {
    }
    //Connect to API if value is not empty
  };

  const toggleForm = (value) => {
    setAddForm(value);
  };

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, props.attributeType).then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getAttributeMeta(props.attributeType).then((res) => {
      let opt = [];
      if (props.currentValue != "") {
        opt.push(props.currentValue);
      }
      if (res && res.data && res.data.attributeValues) {
        _.each(res.data.attributeValues, (arr) => {
          if (arr.ATTR_VALUE != props.currentValue) {
            opt.push(arr.ATTR_VALUE);
          }
        });
      }
      setClassification(opt);
    });
  }, []);

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Classification Attribute"}
    >
      {!addForm && (
        <form>
          <FormField>
            <label>Attribute Type</label>
            <Input
              value={account.attributeType || ""}
              showClearIcon={false}
              width="250px"
              height="30px"
              readOnly={true}
            />
          </FormField>
          <FormField>
            <label class="MandatoryLabel">Current Value</label>
            <TypeAheadDropDown
              placeholder=" Type Value"
              width="250px"
              height="30px"
              //clearText={() => clearField("classification")}
              onSelect={selected}
              items={classification}
              value={account.classification}
            />
            <a
              onClick={(e) => {
                toggleForm(true);
              }}
            >
              <span class="fa fa-fw fa-plus icon-lg" />
            </a>
          </FormField>
          <FormField>
            <label class="MandatoryLabel">Start Date</label>
            <DatePicker
              value={account.startDate}
              onChange={(value) => {
                changeAccountDate(value, "startDate");
              }}
            />
          </FormField>
          <FormField>
            <label class="MandatoryLabel">End Date</label>
            <DatePicker
              value={account.endDate}
              onChange={(value) => {
                changeAccountDate(value, "endDate");
              }}
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
      )}
      {addForm && (
        <form>
          <FormField>
            <label>Attribute Type</label>
            <Input
              value={account.attributeType || ""}
              showClearIcon={false}
              width="250px"
              height="30px"
              readOnly={true}
            />
          </FormField>
          <FormField>
            <label class="MandatoryLabel">New Value</label>
            <Input
              value={newValue.classification || ""}
              showClearIcon={false}
              width="250px"
              height="30px"
              onTextChange={(e) => {
                setClassificationValue("classification", e.target.value);
              }}
            />
            <a
              onClick={(e) => {
                toggleForm(false);
              }}
            >
              <span class="fa fa-fw fa-close icon-lg" />
            </a>
          </FormField>
          <span className="helperMessage">
            You are about to add a new value to the List of Values
          </span>
          <FormField>
            <label class="MandatoryLabel">Start Date</label>
            <DatePicker
              value={newValue.startDate}
              onChange={(value) => {
                changeValueDate(value, "startDate");
              }}
            />
          </FormField>
          <FormField>
            <label class="MandatoryLabel">End Date</label>
            <DatePicker
              value={newValue.startDate}
              onChange={(value) => {
                changeValueDate(value, "startDate");
              }}
            />
          </FormField>
          <FormField>
            <label>Comments</label>
            <TextArea
              value={newValue.comments}
              cols={38}
              rows={5}
              changeFunc={(value) => {
                setClassificationValue("comments", value);
              }}
            />
          </FormField>
          <SearchButtons>
            <ButtonFilled onButtonClick={(e) => addValue(e)}>Add</ButtonFilled>
            <ButtonOutLine onButtonClick={closePopup}>Cancel</ButtonOutLine>
          </SearchButtons>
        </form>
      )}
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

export default Classification;
