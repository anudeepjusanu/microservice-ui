import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, A } from "./AccountDetailsStyles";
import { getReportingList } from "services/accountDetailsService";
import { format } from "date-fns";
import TableWithPagination from "components/TableWithPagination";
import { ReportingEdit } from "components/Popups";
import _ from "lodash";

function Reporting(props) {
  const [reporting, setReporting] = useState([]);
  const [attribute, setAttribute] = useState({});
  const [modelOpen, setModelOpen] = useState({
    reportingType: false,
  });

  useEffect(() => {
    getReportingList(props.goldenAccountId).then((res) => {
      if (res.data && res.data.reporting) {
        _.each(res.data.reporting, (data) => {
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
        setReporting(res.data);
      }
    });
  }, []);

  const showEdit = (row) => {
    setAttribute(row.original);
    setModelOpen({
      ...modelOpen,
      reportingType: true,
    });
  };

  const closeModal = () => {
    setModelOpen({
      ...modelOpen,
      reportingType: false,
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
        data={reporting.reporting}
        paginationData={
          reporting.pagenation ? reporting.pagenation.totalCount : 0
        }
        showPagination={false} //{reporting.reporting && reporting.reporting.length ? true: false}
        noDataText={"No Reporting to Show"}
      />
      {modelOpen.reportingType && (
        <ReportingEdit
          modelOpen={modelOpen.reportingType}
          closeModal={closeModal}
          goldenAccountId={props.goldenAccountId}
          currentValue={attribute.GOLDEN_ACCOUNT_ATTR_VALUE || ""}
          attributeType={attribute.GOLDEN_ACCOUNT_ATTR_TYPE_NAME}
        />
      )}
    </React.Fragment>
  );
}

export default Reporting;
