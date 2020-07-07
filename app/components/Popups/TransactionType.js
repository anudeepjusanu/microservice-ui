import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import Input from "../Input";
import TypeAheadDropDown from "components/TypeAheadDropDown";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import DatePicker from "./../Datepicker";
import {
  getChangeHistory,
  updateAttribute,
  addLovValue,
} from "services/accountDetailsService";
import { getTransactionMeta } from "services/goldenSearchService";
import "./styles.css";
import { useAlert } from "react-alert";

function TransactionType(props) {
  const childRef1 = useRef();
  const childRef2 = useRef();

  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const alert = useAlert();
  const [history, setHistory] = useState([]);
  const [account, setAccount] = useState({
    comments: "",
    transactionType: props.currentValue || "",
    startDate: format(new Date("1900-01-01"), "MM-dd-yyyy"),
    endDate: format(new Date("2100-12-31"), "MM-dd-yyyy"),
  });
  const [transactions, setTransaction] = useState([]);
  const [addForm, setAddForm] = useState(false);
  const [newValue, setNewValue] = useState({
    transactionType: "",
    comments: "",
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
    props.closeModal("transactionType");
  };

  const selected = (value) => {
    setAccount({
      ...account,
      transactionType: value,
    });
  };

  const changeComments = (value) => {
    setAccount({
      ...account,
      comments: value,
    });
  };

  const changeAccountDate = (value, key) => {
    setAccount({
      ...account,
      [key]: value,
    });
  };

  const setTransactionType = (key, value) => {
    setNewValue({
      ...newValue,
      [key]: value,
    });
  };

  const updateAccount = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (account.transactionType.value != "-") {
      setIsInvalid(false);
      if (account.transactionType.value != props.currentValue) {
        if (new Date(account.startDate) < new Date(account.endDate)) {
          const obj = {
            ATTRIBUTE: "TRANSACTION_TYPE",
            GOLDEN_ACCOUNT_ID: props.goldenAccountId,
            CURRENTVALUE: props.currentValue,
            NEWVALUE: account.transactionType,
            SUBMITTED_BY: "Anudeep",
            SUBMITTED_COMMENT: account.comments,
            STARTDATE: format(new Date(account.startDate), "yyyy-MM-dd"),
            ENDDATE: format(new Date(account.endDate), "yyyy-MM-dd"),
          };
          setDisabled(true);
          updateAttribute(obj).then((res) => {
            if (res && res.data && res.data.status) {
              props.closeModal("transactionType", true);
            }
            alert.success("Change request sent for approval");
            setDisabled(false);
          });
        } else {
          alert.error("Start date cannot be less than end date");
        }
      } else {
        alert.error("Please select new value");
        console.log("Please select a value");
      }
    } else {
      setIsInvalid(true);
    }

    //Connect to API if value is not empty
  };

  const addValue = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newValue.transactionType != "") {
      setIsInvalid(false);
      const obj = {
        GOLDEN_ACCOUNT_ATTR_TYPE_NAME: "TRANSACTION_TYPE",
        NEWVALUE: newValue.transactionType,
        STARTDATE: "1900-01-01",
        ENDDATE: "2100-12-31",
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: newValue.comments,
      };
      addLovValue(obj).then((res) => {
        if (res && res.data && res.data.data) {
          closePopup();
        }
      });
    } else {
      setIsInvalid(true);
    }
  };

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, "TRANSACTION_TYPE").then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getTransactionMeta().then((res) => {
      let opt = [];
      if (props.currentValue != "") {
        opt.push(props.currentValue);
      }
      if (res && res.data && res.data.transactionTypes) {
        _.each(res.data.transactionTypes, (arr) => {
          if (arr.STATERGIC_IMPORTANCE != props.currentValue) {
            opt.push(arr.STATERGIC_IMPORTANCE);
          }
        });
      }
      setTransaction(opt);
    });
  }, []);

  const toggleForm = (value) => {
    setAddForm(value);
  };

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Transaction Type"}
    >
      {!addForm && (
        <form
          onClick={(e) => {
            if (childRef1.current) {
              childRef1.current.closeCalendar();
            }
            if (childRef2.current) {
              childRef2.current.closeCalendar();
            }
          }}
        >
          <FormField>
            <label class="MandatoryLabel">Current Value</label>
            <TypeAheadDropDown
              placeholder=" Type Industry Code"
              width="250px"
              height="30px"
              //clearText={() => clearField("classification")}
              onSelect={selected}
              items={transactions}
              value={account.transactionType}
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
              ref={childRef1}
            />
          </FormField>
          <FormField>
            <label class="MandatoryLabel">End Date</label>
            <DatePicker
              value={account.endDate}
              onChange={(value) => {
                changeAccountDate(value, "endDate");
              }}
              ref={childRef2}
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
            <label class="MandatoryLabel">New Value</label>
            <Input
              value={newValue.transactionType || ""}
              showClearIcon={false}
              width="250px"
              height="30px"
              onTextChange={(e) => {
                setTransactionType("transactionType", e.target.value);
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
            <label>Comments</label>
            <TextArea
              value={newValue.comments}
              cols={38}
              rows={5}
              changeFunc={(value) => {
                setTransactionType("comments", value);
              }}
            />
          </FormField>
          <SearchButtons>
            <ButtonFilled onButtonClick={(e) => addValue(e)}>Add</ButtonFilled>
            <ButtonOutLine onButtonClick={closePopup}>Cancel</ButtonOutLine>
          </SearchButtons>
        </form>
      )}
      <h1
        onClick={(e) => {
          if (childRef1.current) {
            childRef1.current.closeCalendar();
          }
          if (childRef2.current) {
            childRef2.current.closeCalendar();
          }
        }}
      >
        Change History
      </h1>
      <div
        onClick={(e) => {
          if (childRef1.current) {
            childRef1.current.closeCalendar();
          }
          if (childRef2.current) {
            childRef2.current.closeCalendar();
          }
        }}
      >
        <TableWithPagination
          columns={columns}
          data={history}
          showPagination={false}
          noDataText={"No Items to Show..."}
          customCls="height200"
        />
      </div>
    </Model>
  );
}

export default TransactionType;
