import React, { useEffect, useState, useRef } from "react";
import { FormField, SearchButtons } from "./styles";
import { format } from "date-fns";
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
import { getStrategicMeta } from "services/goldenSearchService";
import DatePicker from "./../Datepicker";
import "./styles.css";
import { useAlert } from "react-alert";

function channelPosition(props) {
  const childRef1 = useRef();
  const childRef2 = useRef();

  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    channelPosition: props.currentValue || "",
    startDate: format(new Date("1900-01-01"), "MM-dd-yyyy"),
    endDate: format(new Date("2100-12-31"), "MM-dd-yyyy"),
  });

  const alert = useAlert();
  const [position, setPosition] = useState([]);
  const [history, setHistory] = useState([]);
  const [addForm, setAddForm] = useState(false);
  const [newValue, setNewValue] = useState({
    channelPosition: "",
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
    props.closeModal("channelPosition");
  };

  const selected = (value) => {
    setAccount({
      ...account,
      channelPosition: value,
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

  const updateAccount = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (account.channelPosition.value != "-") {
      setIsInvalid(false);
      const obj = {
        ATTRIBUTE: "CHANNEL_POSITION",
        GOLDEN_ACCOUNT_ID: props.goldenAccountId,
        CURRENTVALUE: props.currentValue,
        NEWVALUE: account.channelPosition,
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: account.comments,
        STARTDATE: format(new Date(account.startDate), "yyyy-MM-dd"),
        ENDDATE: format(new Date(account.endDate), "yyyy-MM-dd"),
      };
      setDisabled(true);
      updateAttribute(obj).then((res) => {
        if (res && res.data && res.data.status) {
          props.closeModal("channelPosition", true);
        }
        alert.success("Change request sent for approval");
        setDisabled(false);
      });
    } else {
      console.log("Please select a value");
      alert.error("Please select new value");
      setIsInvalid(true);
    }

    //Connect to API if value is not empty
  };

  const setChannelPositionValue = (key, value) => {
    setNewValue({
      ...newValue,
      [key]: value,
    });
  };

  const addValue = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newValue.channelPosition != "") {
      setIsInvalid(false);
      const obj = {
        GOLDEN_ACCOUNT_ATTR_TYPE_NAME: "STRATEGIC_IMPORTANCE",
        NEWVALUE: newValue.channelPosition,
        STARTDATE: "1900-01-01",
        ENDDATE: "2100-12-31",
        SUBMITTED_BY: "Anudeep",
        SUBMITTED_COMMENT: newValue.comments,
      };
      addLovValue(obj).then((res) => {
        if (res && res.data && res.data.status) {
          props.closeModal("channelPosition", true);
          alert.success("Change request sent for approval");
        }
      });
    } else {
      setIsInvalid(true);
      alert.success("Change request sent for approval");
    }
    //Connect to API if value is not empty
  };

  const toggleForm = (value) => {
    setAddForm(value);
  };

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, "CHANNEL_POSITION").then((res) => {
      if (res && res.data && res.data.data) {
        setHistory(res.data.data);
      }
    });
    getStrategicMeta().then((res) => {
      let opt = [];
      if (props.currentValue != "") {
        opt.push(props.currentValue);
      }
      if (res && res.data && res.data.strategicImportances) {
        _.each(res.data.strategicImportances, (arr) => {
          if (arr.STATERGIC_IMPORTANCE != props.currentValue) {
            opt.push(arr.STATERGIC_IMPORTANCE);
          }
        });
      }
      setPosition(opt);
    });
  }, []);

  const clicked1 = (e) => {
    console.log("CLICKED1");
    e.stopPropagation();
  };

  const clicked2 = (e) => {
    console.log("CLICKED2");
    e.stopPropagation();
  };

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Channel Position"}
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
            <label class="MandatoryLabel">Channel Position</label>
            <TypeAheadDropDown
              placeholder=" Type Value"
              width="250px"
              height="30px"
              //clearText={() => clearField("classification")}
              onSelect={selected}
              items={position}
              value={account.channelPosition}
            />
            <a
              onClick={(e) => {
                toggleForm(true);
              }}
            >
              <span class="fa fa-fw fa-plus icon-lg" />
            </a>
          </FormField>
          <FormField onClick={(e) => clicked1(e)}>
            <label class="MandatoryLabel">Start Date</label>
            <DatePicker
              value={account.startDate}
              onChange={(value) => {
                changeAccountDate(value, "startDate");
              }}
              ref={childRef1}
              id="datePicker1"
            />
          </FormField>
          <FormField onClick={(e) => clicked2(e)}>
            <label class="MandatoryLabel">End Date</label>
            <DatePicker
              value={account.endDate}
              onChange={(value) => {
                changeAccountDate(value, "endDate");
              }}
              ref={childRef1}
              id="datePicker2"
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
              }}
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
            <label>Channel Position*</label>
            <Input
              value={newValue.channelPosition || ""}
              showClearIcon={false}
              width="250px"
              onTextChange={(e) => {
                setChannelPositionValue("channelPosition", e.target.value);
              }}
            />
            <a
              onClick={(e) => {
                toggleForm(false);
              }}
            >
              {/* <span class="fa fa-fw fa-plus" /> */}
              close
            </a>
          </FormField>
          <FormField>
            <label>Comments</label>
            <TextArea
              value={newValue.comments}
              cols={38}
              rows={5}
              changeFunc={(value) => {
                setChannelPositionValue("comments", value);
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

export default channelPosition;
