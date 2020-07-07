import React, { useEffect, useState } from "react";
import Input from "../Input";
import {
  Section,
  FormColumn,
  FormField,
  Label,
  SearchButtons,
  Article,
  Button,
} from "./SearchFormStyles";
import { ButtonFilled, ButtonOutLine } from "../Button";
import { getSearchFormMetaData } from "services/goldenSearchService";
import TypeAheadDropDown from "components/TypeAheadDropDown";
import TypeAheadRemote from "components/TypeAheadRemote";

function GoldenSearchForm(props) {
  const [searchRequest, setReq] = useState({});
  const [tiers, setTiers] = useState([]);
  const [tiersData, setTiersData] = useState([]);
  const [AccountName, setAccName] = useState("");
  const [AccountNumber, setAccNumber] = useState("");
  const [LogitechAccountId, setLogiAccId] = useState("");
  const [ZymeId, setZymeId] = useState("");
  const [ValidZymeId, setValidZymeId] = useState("");
  const [ValidZymeName, setValidZymeName] = useState("");
  const [channelGroupingName, setChannelGrouping] = useState("");

  const [strategic, setStrategic] = useState([]);
  const [strategicData, setStrategicData] = useState([]);

  const [country, setCountry] = useState([]);
  const [countryData, setCountryData] = useState([]);

  const [region, setRegion] = useState([]);
  const [regionData, setRegionData] = useState([]);

  const [industry, setIndustry] = useState([]);
  const [industryData, setIndustryData] = useState([]);

  const [classification, setClassification] = useState([]);
  const [classificationData, setClassificationData] = useState([]);

  const [classificationValues, setClassificationValues] = useState([]);
  const [classificationValuesData, setClassificationValuesData] = useState([]);

  const [t3, setT3] = useState([]);
  const [t3Data, setT3Data] = useState([]);
  const [typeAheadValue, setTypeAheadValue] = useState({
    t3: "",
    tier: "",
    strategic: "",
    country: "",
    region: "",
    classificationType: "",
    classificationValue: "",
  });
  const [t3Value, setT3Value] = useState("");

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    getSearchFormMetaData().then((res) => {
      setShowLoading(false);
      let perm = [];
      setTiersData(res.data.tiers);
      res.data.tiers.forEach((element) => {
        perm.push(element.TIER);
      });
      setTiers(perm);
      let strategic = [];
      setStrategicData(res.data.strategicImportances);
      res.data.strategicImportances.forEach((element) => {
        strategic.push(element.STATERGIC_IMPORTANCE);
      });
      setStrategic(strategic);
      //    ############
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
      //    ###################
      let region = [];
      setRegionData(res.data.regions);
      res.data.regions.forEach((element) => {
        region.push(element.REGION);
      });
      setRegion(region);
      // ###########
      let industry = [];
      setIndustryData(res.data.industryCodes);
      res.data.industryCodes.forEach((element) => {
        industry.push(element.INDUSTRY_CODE);
      });
      setIndustry(industry);

      //ClassificationType
      let classification = [];
      setClassificationData(res.data.classificationTypes);
      res.data.classificationTypes.forEach((element) => {
        classification.push(element.CLASSIFICATION_TYPE);
      });
      setClassification(classification);
      //  ClassificationValues
      let classificationValues = [];
      setClassificationValuesData(res.data.classificationValues);
      //  let classificationArray = [];
      //    for(let key in res.data.classificationValues){
      //     classificationArray = classificationArray.concat(res.data.classificationValues[key])
      //    }
      //    classificationArray.forEach((element)=>{
      //      classificationValues.push(element.CLASSIFICATION_VALUE);
      //  })
      //   setClassificationValues(classificationValues);
      //T3_MASTER_IDENTIFIER
      let t3 = [];
      setT3Data(res.data.t3MasterIdentifiers);
      res.data.t3MasterIdentifiers.forEach((element) => {
        t3.push(element.T3_MASTER_IDENTIFIER);
      });
      setT3(t3);
    });
  }, []);

  const tireSelected = (selectedTire) => {
    tiersData.forEach((tire) => {
      if (tire.TIER === selectedTire) {
        let newReq = { ...searchRequest };
        newReq.tire = tire;
        setReq({ ...searchRequest, value: newReq });
        setTypeAheadValue({
          ...typeAheadValue,
          tire: tire.TIER,
        });
      }
    });
  };

  const strategicSelected = (selectedStrategic) => {
    strategicData.forEach((strategic) => {
      if (strategic.STATERGIC_IMPORTANCE === selectedStrategic) {
        searchRequest.strategic = strategic;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          strategic: strategic.STATERGIC_IMPORTANCE,
        });
      }
    });
  };

  const countrySelected = (selectedCountry) => {
    let countries = [];
    for (let key in countryData) {
      countries = countries.concat(countryData[key]);
    }
    countries.forEach((country) => {
      if (country.COUNTRY === selectedCountry) {
        searchRequest.country = country;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          country: country.COUNTRY,
        });
      }
    });
  };

  const regionSelected = (selectedRegion) => {
    let countriesList = [];
    searchRequest.region = selectedRegion;
    setReq(searchRequest);
    setTypeAheadValue({
      ...typeAheadValue,
      region: searchRequest.region,
    });
    countryData[selectedRegion].forEach((element) => {
      countriesList.push(element.COUNTRY);
    });
    setCountry(countriesList);
  };
  const industrySelected = (selectedIndustry) => {
    industryData.forEach((industry) => {
      if (industry.INDUSTRY_CODE === selectedIndustry) {
        searchRequest.industry = industry;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          industry: industry.INDUSTRY_CODE,
        });
      }
    });
  };
  const classificationSelected = (selectedClassification) => {
    console.log(selectedClassification);
    let classificationValues = [];
    classificationData.forEach((classification) => {
      if (classification.CLASSIFICATION_TYPE === selectedClassification) {
        searchRequest.classification = classification;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          classificationType: classification.CLASSIFICATION_TYPE,
        });
      }
    });
    classificationValuesData[selectedClassification].forEach((element) => {
      classificationValues.push(element.CLASSIFICATION_VALUE);
    });

    setClassificationValues(classificationValues);
  };
  const classificationValueSelected = (selectedClassificationValues) => {
    let classificationValues = [];
    let classificationDataArray = [];
    for (let key in classificationValuesData) {
      classificationDataArray = classificationDataArray.concat(
        classificationValuesData[key]
      );
    }
    classificationDataArray.forEach((classificationValues) => {
      if (
        classificationValues.CLASSIFICATION_VALUE ===
        selectedClassificationValues
      ) {
        searchRequest.selectedClassificationValues = classificationValues;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          classificationValue: classificationValues.CLASSIFICATION_VALUE,
        });
      }
    });
  };

  const t3Selected = (selectedT3) => {
    t3Data.forEach((t3) => {
      if (t3.T3_MASTER_IDENTIFIER === selectedT3) {
        searchRequest.selectedT3 = t3;
        setReq(searchRequest);
        setTypeAheadValue({
          ...typeAheadValue,
          t3: t3.T3_MASTER_IDENTIFIER,
        });
      }
    });
  };

  const clearField = (type) => {
    searchRequest[type] = undefined;
    setReq(searchRequest);
    switch (type) {
      case "accountName":
        setAccName("");
        break;
      case "accountNumber":
        setAccNumber("");
        break;
      case "logitechAccId":
        setLogiAccId("");
        break;
      case "zymeId":
        setZymeId("");
        break;
      case "validZymeId":
        setValidZymeId("");
        break;
      case "validZymeName":
        setValidZymeName("");
        break;
      case "channelGroupingName":
        setChannelGrouping("");
        break;
    }
  };

  const clearFields = () => {
    setAccName("");
    setAccNumber("");
    setLogiAccId("");
    setZymeId("");
    setValidZymeId("");
    setValidZymeName("");
    setChannelGrouping("");
    setTypeAheadValue({
      t3: "",
      tier: "",
      strategic: "",
      country: "",
      region: "",
      classificationType: "",
      classificationValue: "",
    });
    setReq({});
    props.resetForm();
  };

  const setAccountName = (e) => {
    searchRequest.accountName = e.target.value;
    setReq(searchRequest);
    setAccName(e.target.value);
  };

  const setAccountNumber = (e) => {
    searchRequest.accountNumber = e.target.value;
    setReq(searchRequest);
    setAccNumber(e.target.value);
  };

  const setLogitechAccId = (e) => {
    searchRequest.logitechAccId = e.target.value;
    setReq(searchRequest);
    setLogiAccId(e.target.value);
  };

  const zymeIdSelected = (e) => {
    searchRequest.zymeId = e.target.value;
    setReq(searchRequest);
    setZymeId(e.target.value);
  };

  const validZymeIdSelected = (e) => {
    searchRequest.validZymeId = e.target.value;
    setReq(searchRequest);
    setValidZymeId(e.target.value);
  };

  const validZymeNameSelected = (e) => {
    searchRequest.validZymeName = e.target.value;
    setReq(searchRequest);
    setValidZymeName(e.target.value);
  };

  const channelGroupingNameSelected = (e) => {
    searchRequest.channelGroupingName = e;
    setReq(searchRequest);
    setChannelGrouping(e);
  };

  return (
    <Article>
      {showLoading && <Button>Loading...</Button>}
      <Section>
        <FormColumn>
          <FormField>
            <Label>Account Name</Label>
            <Input
              width="200px"
              value={AccountName}
              clearText={() => clearField("accountName")}
              onTextChange={setAccountName}
              showClearIcon={true}
            />
          </FormField>
          <FormField>
            <Label>Account Number</Label>
            <Input
              value={AccountNumber}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setAccountNumber}
              showClearIcon={true}
            />
          </FormField>
          <FormField>
            <Label>Logitech Account Id</Label>
            <Input
              value={LogitechAccountId}
              width="200px"
              clearText={() => clearField("logitechAccId")}
              onTextChange={setLogitechAccId}
              showClearIcon={true}
            />
          </FormField>
          <FormField>
            <Label>Classification Type</Label>
            <TypeAheadDropDown
              placeholder=" Type Classification Type"
              width="200px"
              height="30px"
              clearText={() => clearField("classification")}
              onSelect={classificationSelected}
              items={classification}
              value={typeAheadValue.classificationType}
            />
          </FormField>
          <FormField>
            <Label>Classification Value</Label>
            <TypeAheadDropDown
              placeholder=" Type Classification Value"
              width="200px"
              height="30px"
              clearText={() => clearField("selectedClassificationValues")}
              onSelect={classificationValueSelected}
              items={classificationValues}
              value={typeAheadValue.classificationValue}
            />
          </FormField>
        </FormColumn>
        <FormColumn>
          <FormField>
            <Label>Zyme Id</Label>
            <Input
              value={ZymeId}
              clearText={() => clearField("zymeId")}
              onTextChange={zymeIdSelected}
              showClearIcon={true}
              width="200px"
            />
          </FormField>
          <FormField>
            <Label>Valid Zyme Id</Label>
            <Input
              value={ValidZymeId}
              clearText={() => clearField("validZymeId")}
              onTextChange={validZymeIdSelected}
              showClearIcon={true}
              width="200px"
            />
          </FormField>
          <FormField>
            <Label>Valid Zyme Business Name</Label>
            <Input
              value={ValidZymeName}
              clearText={() => clearField("validZymeName")}
              onTextChange={validZymeNameSelected}
              showClearIcon={true}
              width="200px"
            />
          </FormField>
          <FormField>
            <Label>Channel Grouping Parent</Label>
            <TypeAheadRemote
              placeholder=" Type Channel Grouping"
              value={channelGroupingName}
              clearText={() => clearField("channelGroupingName")}
              onSelect={channelGroupingNameSelected}
              showClearIcon={true}
              width="200px"
            />
          </FormField>
          <FormField>
            <Label>Industry Code</Label>
            <TypeAheadDropDown
              placeholder=" Type Industry Code"
              width="200px"
              height="30px"
              clearText={() => clearField("industry")}
              onSelect={industrySelected}
              items={industry}
              value={typeAheadValue.industry}
            />
          </FormField>
        </FormColumn>
        <FormColumn>
          <FormField>
            <Label>Tier</Label>
            <TypeAheadDropDown
              placeholder=" Type Tier"
              width="200px"
              height="30px"
              clearText={() => clearField("tire")}
              onSelect={tireSelected}
              items={tiers}
              value={typeAheadValue.tier}
            />
          </FormField>
          <FormField>
            <Label>Strategic Importance</Label>
            <TypeAheadDropDown
              placeholder=" Type Strategic Importance"
              width="200px"
              height="30px"
              clearText={() => clearField("strategic")}
              onSelect={strategicSelected}
              items={strategic}
              value={typeAheadValue.strategic}
            />
          </FormField>
          <FormField>
            <Label>Country</Label>
            <TypeAheadDropDown
              placeholder=" Type Country"
              width="200px"
              height="30px"
              clearText={() => clearField("country")}
              onSelect={countrySelected}
              items={country}
              value={typeAheadValue.country}
            />
          </FormField>
          <FormField>
            <Label>Region</Label>
            <TypeAheadDropDown
              placeholder=" Type Region"
              width="200px"
              height="30px"
              clearText={() => clearField("region")}
              onSelect={regionSelected}
              items={region}
              value={typeAheadValue.region}
            />
          </FormField>
          <FormField>
            <Label>T3 Master Identifier</Label>
            <TypeAheadDropDown
              placeholder=" Type T3 Master Identifier"
              width="200px"
              clearText={() => clearField("selectedT3")}
              onSelect={t3Selected}
              items={t3}
              value={typeAheadValue.t3}
            />
          </FormField>
        </FormColumn>
      </Section>
      <SearchButtons>
        <ButtonFilled onButtonClick={() => props.Click(searchRequest)}>
          Search
        </ButtonFilled>
        <ButtonOutLine onButtonClick={clearFields}>RESET</ButtonOutLine>
      </SearchButtons>
    </Article>
  );
}

export default GoldenSearchForm;
