import React, { useEffect, useState } from "react";
import { FormField, SearchButtons } from "./styles";
import TextArea from "../TextArea";
import SelectBox from "components/Select";
import TypeAheadRemote from "components/TypeAheadRemote";
import Model from "components/Model";
import { ButtonFilled, ButtonOutLine } from "../Button";
import TableWithPagination from "components/TableWithPagination";
import {
  getChangeHistory,
  updateAttribute,
  loadParentValues,
} from "services/accountDetailsService";
import { useAlert } from "react-alert";
import _ from "lodash";

function GroupingParent(props) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState({
    comments: "",
    groupingParent: props.currentValue || "",
    value: "-",
  });
  const alert = useAlert();
  const [history, setHistory] = useState([]);
  const [options, setOptions] = useState([
    {
      label: "-",
      value: "-",
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

  const _onSelect = () => {};

  const loadValues = (value) => {
    loadParentValues(value).then((res) => {
      if (res && res.data && res.data.data) {
        let opts = [
          {
            label: "-",
            value: "-",
          },
        ];
        let arr = _.filter(res.data.data, function(o) {
          return o.LOGITECH_PARTY_NAME === value;
        });
        _.each(arr, (a) => {
          opts.push({
            label:
              a.LOGITECH_PARTY_ID +
              " " +
              a.ERP_COUNTRY_CD +
              " " +
              a.LOGITECH_PARTY_NAME,
            value: a.LOGITECH_PARTY_ID,
          });
        });
        setOptions(opts);
      }
    });
  };

  const closePopup = () => {
    props.closeModal("groupingParent");
  };

  const parentSelected = (value) => {
    loadValues(value);
    setAccount({
      ...account,
      groupingParent: value,
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
    if (account.groupingParent.value != "-") {
      setIsInvalid(false);
      if (account.groupingParent.value != props.currentValue) {
        const obj = {
          ATTRIBUTE: "LOGITECH_PARTY_NAME",
          GOLDEN_ACCOUNT_ID: props.goldenAccountId,
          CURRENTVALUE: props.currentValue,
          NEWVALUE: account.groupingParent,
          SUBMITTED_BY: "Anudeep",
          SUBMITTED_COMMENT: account.comments,
        };
        setDisabled(true);
        updateAttribute(obj).then((res) => {
          if (res && res.data && res.data.status) {
            props.closeModal("groupingParent", true);
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

  useEffect(() => {
    getChangeHistory(props.goldenAccountId, "LOGITECH_PARTY_NAME").then(
      (res) => {
        if (res && res.data && res.data.data) {
          setHistory(res.data.data);
        }
      }
    );
  }, []);

  return (
    <Model
      open={props.modelOpen}
      closeModal={closePopup}
      title={"Edit Channel Grouping Parent"}
    >
      <form>
        <FormField>
          <label class="MandatoryLabel">Channel Grouping Parent</label>
          <TypeAheadRemote
            placeholder="Type value"
            width="250px"
            height="30px"
            //clearText={() => clearField("classification")}
            onSelect={parentSelected}
            value={account.groupingParent}
          />
        </FormField>
        <FormField>
          <label class="MandatoryLabel">Value</label>
          <SelectBox
            data={options}
            onSelect={_onSelect}
            defaultOption={account.value}
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

export default GroupingParent;
