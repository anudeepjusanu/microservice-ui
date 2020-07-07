import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, A } from "./AccountDetailsStyles";
import { format } from "date-fns";
import { getAccountClassification } from "services/accountDetailsService";
import TableWithPagination from "components/TableWithPagination";
import { Classification } from "components/Popups";
import _ from "lodash";

function AccountClasification(props) {
  const [accountClassification, setAccountClassification] = useState([]);
  const [attribute, setAttribute] = useState({});
  const [modelOpen, setModelOpen] = useState({
    classificationType: false,
  });
  useEffect(() => {
    getAccountClassification(props.goldenAccountId).then((res) => {
      if (res.data && res.data.accountClassification) {
        _.each(res.data.accountClassification, (data) => {
          _.each(data, (value, key) => {
            if (!value) {
              data[key] = "-";
            } else {
              if (key == "EFF_END_DATE" || key == "EFF_START_DATE") {
                data[key] = format(new Date(value), "MM-dd-yyyy");
              }
            }
          });
        });
        setAccountClassification(res.data.accountClassification);
      }
    });
  }, []);

  const showEdit = (row) => {
    setAttribute(row.original);
    setModelOpen({
      ...modelOpen,
      classificationType: true,
    });
  };

  const closeModal = () => {
    setModelOpen({
      ...modelOpen,
      classificationType: false,
    });
  };

  const ClassificationAndReportingColumns = [
    {
      Header: "Attribute Type",
      accessor: "GOLDEN_ACCOUNT_ATTR_TYPE_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
      Cell: (row) => <A onClick={() => showEdit(row)}>{row.value}</A>,
    },
    {
      Header: "Attribute Value",
      accessor: "GOLDEN_ACCOUNT_ATTR_VALUE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Start Date",
      accessor: "EFF_START_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "End Date",
      accessor: "EFF_END_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
  ];

  return (
    <React.Fragment>
      <ExportToExcel>Export to Excel</ExportToExcel>
      <TableWithPagination
        columns={ClassificationAndReportingColumns}
        data={accountClassification}
        showPagination={false}
        noDataText={"No Account Clasification to Show"}
      />
      {modelOpen.classificationType && (
        <Classification
          modelOpen={modelOpen.classificationType}
          closeModal={closeModal}
          goldenAccountId={props.goldenAccountId}
          currentValue={attribute.GOLDEN_ACCOUNT_ATTR_VALUE || ""}
          attributeType={attribute.GOLDEN_ACCOUNT_ATTR_TYPE_NAME}
        />
      )}
    </React.Fragment>
  );
}

export default AccountClasification;
