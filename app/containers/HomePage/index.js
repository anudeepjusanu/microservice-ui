import React, { useEffect, memo, useState } from "react";
import GoldenSearchForm from "components/GoldenSearchForm";
import { SearchFormTitle, Article, A, Button, ExportExcel } from "./HomePageStyles";
import TableWithPagination from "components/TableWithPagination";
import { getSearchResult } from "services/goldenSearchService";
import { withRouter } from "react-router-dom";
import history from "utils/history";

export function HomePage() {
  const [result, setSearchResult] = useState([]);
  const [request, setSearchRequest] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {}, []);

  const navigateToDetailPage = (row) => {
    history.push(`/Account_details/${row.row._original.GOLDEN_ACCOUNT_ID}`);
  };

  const columns = [
    {
      Header: "Account Name",
      accessor: "GOLDEN_ACCOUNT_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 150,
      Cell: (row) => (
        <A onClick={() => navigateToDetailPage(row)}>{row.value}</A>
      ),
      sortMethod: (a, b) => {
        console.log("LLLLLLLLLLL");
      }
    },
    {
      Header: "Logitech Account ID",
      accessor: "LOGITECH_ACCOUNT_ID",
      minWidth: 150,
      Cell: (row) => (
        <A onClick={() => navigateToDetailPage(row)}>{row.value}</A>
      ),
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
    {
      Header: "Reseller Code",
      accessor: "name",
      minWidth: 90,
    },
    {
      Header: "Exclude From Grouping",
      accessor: "EXCLUDE_MATCH_FLAG",
      minWidth: 150,
    },
    {
      Header: "T3 Master Identifier",
      accessor: "T3_MASTER_IDENTIFIER",
      style: { whiteSpace: "unset" },
      minWidth: 120,
    },
    {
      Header: "Industry Code",
      accessor: "INDUSTRY_CODE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
  ];

  const sendSearchRequest = (req, page, saveReq) => {
    setShowLoading(true);
    if (saveReq) {
      setSearchRequest(req);
    }
    getSearchResult(req, page).then((res) => {
      setSearchResult(res.data);
      setShowLoading(false);
    });
  };

  const resetForm = () => {
    setSearchResult([]);
  };

  const sortSearch = (a, b) => {
    let order = 'DESC';
    if(a[0].desc){
      order = 'ASC';
    }
    request.orderField = a[0].id;
    request.orderAsc = order;
    sendSearchRequest(request, 1, false);
  }

  return (
    <Article>
      {showLoading && <Button>Loading...</Button>}
      <SearchFormTitle>Golden Account Search</SearchFormTitle>
      <ExportExcel>Export to Excel</ExportExcel>
      <GoldenSearchForm
        Click={(req) => sendSearchRequest(req, 1, true)}
        resetForm={resetForm}
      />
      <TableWithPagination
        columns={columns}
        data={result.data}
        paginationData={result.pagenation ? result.pagenation.totalCount : 0}
        showPagination={result.data && result.data.length ? true : false}
        pageChange={(page) => sendSearchRequest(request, page, false)}
        sortColumn={sortSearch}
      />
    </Article>
  );
}

export default withRouter(HomePage);
