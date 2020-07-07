import React, { useState, useEffect } from "react";
import "./style.css";
import { Section, FormColumn, FormField, Label, SearchButtons } from "./styles";
import TableWithPagination from "components/TableWithPagination";
import history from "utils/history";
import _ from "lodash";
import Input from "components/Input";
import { ButtonFilled, ButtonOutLine } from "components/Button";
import {
  getSearchResult,
  getSearchFormMetaData,
} from "services/goldenSearchService";
import { reassignService } from "services/accountDetailsService";
import TypeAheadDropDown from "components/TypeAheadDropDown";
import TextArea from "components/TextArea";

function Reassign(props) {
  console.log(props.location);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState({
    accountNumber: "",
    accountName: "",
    logitechAccountId: "",
    businessName: "",
    zymeId: "",
    country: "",
  });
  const [country, setCountry] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [result, setSearchResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  useEffect(() => {
    setShowLoading(true);
    getSearchFormMetaData().then((res) => {
      setShowLoading(false);
      let count = [];
      let countries = [];
      setCountryData(res.data.countries);
      for (let key in res.data.countries) {
        countries = countries.concat(res.data.countries[key]);
      }
      countries.forEach((element) => {
        count.push(element.COUNTRY);
      });
      setCountry(count);
    });
  }, []);

  const handleSelected = (e, row) => {
    e.stopPropagation();
    setSelected(row.original.GOLDEN_ACCOUNT_ID);
  };

  const columns = [
    {
      Header: "",
      Cell: (row) => (
        <input
          type="radio"
          checked={row.original.GOLDEN_ACCOUNT_ID === selected}
          onChange={(e) => handleSelected(e, row)}
        />
      ),
      sortable: false,
      filterable: false,
      width: 50,
    },
    {
      Header: "Account Name",
      accessor: "GOLDEN_ACCOUNT_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 150,
    },
    {
      Header: "Logitech Account ID",
      accessor: "LOGITECH_ACCOUNT_ID",
      minWidth: 150,
    },
    {
      Header: "Account Number",
      accessor: "ACCOUNT_NUMBER",
      minWidth: 120,
    },
    {
      Header: "ZYME ID",
      accessor: "ZYME_ID",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Valid ZYME ID",
      accessor: "VALID_ZYME_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Country",
      accessor: "COUNTRY",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Region",
      accessor: "REGION",
      style: { whiteSpace: "unset" },
      minWidth: 80,
    },
  ];

  const clearField = (key) => {
    setSearch({
      ...search,
      [key]: "",
    });
  };

  const clearFields = () => {
    setSearch({
      accountNumber: "",
      accountName: "",
      logitechAccountId: "",
      businessName: "",
      zymeId: "",
      country: "",
    });
  };

  const setValue = (key, value) => {
    setSearch({
      ...search,
      [key]: value,
    });
  };

  const sendSearchRequest = (req, page, saveReq) => {
    setShowLoading(true);
    var obj = {};
    _.forEach(req, function(value, key) {
      if (value != "") {
        obj[key] = value;
      }
    });

    getSearchResult(obj, page).then((res) => {
      setSearchResult(res.data);
      setShowLoading(false);
    });
  };

  const reassign = () => {
    if (selected && selected != "") {
      setIsInvalid(false);
      const obj = {
        ACCOUNT_IDS: props.location.state.accountIds,
        CURRENT_GOLDEN_ACCOUNT_ID: props.match.params.goldenAccountId,
        NEW_GOLDEN_ACCOUNT_ID: selected,
      };
      reassignService(obj).then(
        (result) => {
          if (result && result.status == 200) {
            goBack();
          }
        },
        (error) => {}
      );
    } else {
      setIsInvalid(true);
    }
  };

  const goBack = () => {
    history.push(`/Account_details/${props.match.params.goldenAccountId}`);
  };

  return (
    <React.Fragment>
      <div className="reassign-container">
        <div className="Title_Section">
          <div className="Heading1">XRef Golden Account Search</div>
        </div>
        <div className="mainContent">
          <div className="mainContainer">
            <div className="filterWrapper">
              <div className="columnsMargin">
                <Section>
                  <FormColumn>
                    <FormField>
                      <Label>Account Name</Label>
                      <Input
                        width="200px"
                        height="32px"
                        value={search.accountName}
                        clearText={() => clearField("accountName")}
                        onTextChange={(e) => {
                          setValue("accountName", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                    <FormField>
                      <Label>Valid Zyme Business Name</Label>
                      <Input
                        value={search.businessName}
                        width="200px"
                        height="32px"
                        clearText={() => clearField("businessName")}
                        onTextChange={(e) => {
                          setValue("businessName", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                  </FormColumn>
                  <FormColumn>
                    <FormField>
                      <Label>Account Number</Label>
                      <Input
                        width="200px"
                        height="32px"
                        value={search.accountNumber}
                        clearText={() => clearField("accountNumber")}
                        onTextChange={(e) => {
                          setValue("accountNumber", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                    <FormField>
                      <Label>Valid Zyme Id</Label>
                      <Input
                        value={search.zymeId}
                        width="200px"
                        height="32px"
                        clearText={() => clearField("zymeId")}
                        onTextChange={(e) => {
                          setValue("zymeId", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                  </FormColumn>
                  <FormColumn>
                    <FormField>
                      <Label>Logitech Account Id</Label>
                      <Input
                        width="200px"
                        height="32px"
                        value={search.logitechAccountId}
                        clearText={() => clearField("logitechAccountId")}
                        onTextChange={(e) => {
                          setValue("logitechAccountId", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                    <FormField>
                      <Label>Country</Label>
                      <Input
                        value={search.country}
                        width="200px"
                        height="32px"
                        clearText={() => clearField("country")}
                        onTextChange={(e) => {
                          setValue("country", e.target.value);
                        }}
                        showClearIcon={true}
                      />
                    </FormField>
                  </FormColumn>
                </Section>
                <SearchButtons>
                  <ButtonFilled
                    onButtonClick={() => sendSearchRequest(search, 1, true)}
                  >
                    Search
                  </ButtonFilled>
                  <ButtonOutLine onButtonClick={clearFields}>
                    RESET
                  </ButtonOutLine>
                </SearchButtons>
              </div>
            </div>
          </div>
          <TableWithPagination
            columns={columns}
            data={result.data}
            paginationData={
              result.pagenation ? result.pagenation.totalCount : 0
            }
            showPagination={result.data && result.data.length ? true : false}
            pageChange={(page) => sendSearchRequest(request, page, false)}
          />
          <div align="right" className="submitComment">
            <div className="OSInline">Submit Comment :&nbsp;</div>
            <TextArea
              value={"abc"}
              cols={38}
              rows={2}
              //changeFunc={changeComments}
            />
            {isInvalid && (
              <span
                className="ValidationMessage"
                role="alert"
                id="ValidationMessage_HendrixTheme_wt63_block_wtMainContent_wt74"
              >
                Please select atleast one value
              </span>
            )}
          </div>
          <div align="right" className="submitButtons">
            <SearchButtons>
              <ButtonFilled onButtonClick={reassign}>Reassign</ButtonFilled>
              <ButtonOutLine onButtonClick={goBack}>Cancel</ButtonOutLine>
            </SearchButtons>
          </div>
          <div align="right" className="submitButtons backButton">
            <SearchButtons>
              <ButtonOutLine onButtonClick={goBack}>BACK</ButtonOutLine>
            </SearchButtons>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Reassign;
