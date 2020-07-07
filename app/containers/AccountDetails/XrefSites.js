import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, A } from "./AccountDetailsStyles";
import { getXrefAccountSites } from "services/accountDetailsService";
import TableWithPagination from "components/TableWithPagination";
import history from "utils/history";
import _ from "lodash";

function XrefSites(props) {
  const [xRefAccountSites, setxRefAccountSites] = useState([]);

  useEffect(() => {
    getXrefAccountSites(props.goldenAccountId).then((res) => {
      setxRefAccountSites(res.data);
    });
  }, []);

  const navigateToDetailPage = (row) => {
    history.push(
      `/xref_sites/${props.goldenAccountId}/${row.original.ACCOUNT_SITE_USE_ID}`
    );
  };

  const XRefAccountsSiteColumn = [
    {
      Header: "Site Use Type",
      accessor: "ACCOUNT_SITE_USE_TYPE",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Primary Site Type",
      accessor: "PRIMARY_FLAG",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Site Use ID",
      accessor: "ACCOUNT_SITE_USE_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
      Cell: (row) => (
        <A onClick={() => navigateToDetailPage(row)}>{row.value}</A>
      ),
    },
    {
      Header: "Store Number",
      accessor: "STORE_NUMBER",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Store Name",
      accessor: "STORE_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Address Line 1",
      accessor: "ADDRESS_LINE1",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Address Line 2",
      accessor: "ADDRESS_LINE2",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "City",
      accessor: "CITY",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "State",
      accessor: "STATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Postal Code",
      accessor: "POSTAL_CD",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Country",
      accessor: "COUNTRY_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "BL Loc Id",
      accessor: "ZYME_LOCATION_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
  ];

  const sortData = (a, b) => {
    let sort = {};
    let order = "DESC";
    if (a[0].desc) {
      order = "ASC";
    }
    sort.orderField = a[0].id;
    sort.orderAsc = order;
    getXrefAccountSites(props.goldenAccountId, sort);
  };

  return (
    <React.Fragment>
      <ExportToExcel>Export to Excel</ExportToExcel>
      <TableWithPagination
        columns={XRefAccountsSiteColumn}
        data={xRefAccountSites.xrefAccountSites}
        paginationData={
          xRefAccountSites.pagenation
            ? xRefAccountSites.pagenation.totalCount
            : 0
        }
        showPagination={false}
        noDataText={"No Xref Account Sites to Show"}
        sortColumn={sortData}
      />
    </React.Fragment>
  );
}

export default XrefSites;
