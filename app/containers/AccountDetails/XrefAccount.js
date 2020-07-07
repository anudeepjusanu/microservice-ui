import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, A, Div } from "./AccountDetailsStyles";
import { format } from "date-fns";
import { getXrefGoldenAccount } from "services/accountDetailsService";
import TableWithPagination from "components/TableWithPagination";
import history from "utils/history";
import _ from "lodash";
import CheckBox from "../../components/Checkbox";
import { ButtonFilled } from "./../../components/Button";

function XrefAccount(props) {
  const [xrefGoldenAccount, setXrefGoldenAccount] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    getXrefGoldenAccount(props.goldenAccountId).then((res) => {
      if (res.data && res.data.recentAccountChanges) {
        _.each(res.data.recentAccountChanges, (xref) => {});
      }
      let checkedCopy = [];
      res.data.xrefGoldenAccounts.forEach((e, index) => {
        e.isChecked = false;
        checkedCopy.push(e);
        e.UPDATED_DATE = format(new Date(e.UPDATED_DATE), "MM-dd-yyyy");
        e.CREATED_DATE = format(new Date(e.CREATED_DATE), "MM-dd-yyyy");
      });
      setChecked([...checkedCopy]);
      setXrefGoldenAccount(res.data);
    });
  }, []);

  const navigateToDetailPage = (row) => {
    history.push(
      `/xref_details/${props.goldenAccountId}/${
        row.original.LOGITECH_ACCOUNT_ID
      }`
    );
  };

  const handleChange = () => {
    var selectall = !selectAll;
    setSelectAll(selectall);
    var checkedCopy = [];
    xrefGoldenAccount.xrefGoldenAccounts.forEach(function(e, index) {
      e.isChecked = selectall;
      checkedCopy.push(e);
    });
    setChecked([...checkedCopy]);
    selectedAttributes();
  };

  const handleSingleCheckboxChange = (index) => {
    console.log(index);
    var checkedCopy = checked;
    checkedCopy[index].isChecked = !checked[index].isChecked;
    if (checkedCopy[index].isChecked === false) {
      setSelectAll(false);
    }
    setChecked([...checkedCopy]);
    selectedAttributes();
  };

  const selectedAttributes = () => {
    const selectedItems = checked.filter((item) => item.isChecked);
    setSelectedItems(selectedItems)
    console.log(selectedItems);
  };

  const XRefAccountColumns = [
    {
      Header: (
        <CheckBox
          type="checkbox"
          onChange={() => handleChange()}
          checked={selectAll}
        />
      ),
      Cell: (row) => (
        <CheckBox
          checked={checked[row.index] && checked[row.index].isChecked}
          onChange={() => handleSingleCheckboxChange(row.index)}
        />
      ),
      sortable: false,
      filterable: false,
      width: 50,
    },
    {
      Header: "Account Number",
      accessor: "ACCOUNT_NUMBER",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Account Name",
      accessor: "ACCOUNT_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Logitech Account ID",
      accessor: "LOGITECH_ACCOUNT_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
      Cell: (row) => (
        <A onClick={() => navigateToDetailPage(row)}>{row.value}</A>
      ),
    },
    {
      Header: "Country",
      accessor: "COUNTRY",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Zyme ID",
      accessor: "ZYME_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Valid Zyme ID",
      accessor: "VALID_ZYME_ID",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Valid Zyme Business Name",
      accessor: "VALID_ZYME_BUSINESS_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Channel Position",
      accessor: "CHANNEL_POSITION",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Master Name",
      accessor: "MASTER_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Src Sys Name",
      accessor: "SOURCE_SYSTEM_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Reseller Code",
      accessor: "CUST_NMBR_AT_DIST",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Update Time Stamp",
      accessor: "UPDATED_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
    {
      Header: "Create Time Stamp",
      accessor: "CREATED_DATE",
      style: { whiteSpace: "unset" },
      minWidth: 100,
    },
  ];

  const reassign = () => {
    let list = [];
    _.each(checked, (obj) => {
      if (obj.isChecked) {
        list.push(obj.ACCOUNT_ID);
      }
    });
    if (list.length) {
      history.push(`/reassign/${props.goldenAccountId}`, {
        accountIds: list,
      });
    }
  };

  const sortData = (a, b) => {
    let sort = {};
    let order = "DESC";
    if (a[0].desc) {
      order = "ASC";
    }
    sort.orderField = a[0].id;
    sort.orderAsc = order;
    getXrefGoldenAccount(props.goldenAccountId, sort);
  };

  return (
    <React.Fragment>
      <Div>
        <ButtonFilled disabled={!selectedItems.length} height="30px" onButtonClick={reassign}>
          Reassign
        </ButtonFilled>
        <ExportToExcel>Export to Excel</ExportToExcel>
      </Div>
      <TableWithPagination
        columns={XRefAccountColumns}
        data={xrefGoldenAccount.xrefGoldenAccounts}
        paginationData={
          xrefGoldenAccount.pagenation
            ? xrefGoldenAccount.pagenation.totalCount
            : 0
        }
        showPagination={false}
        noDataText={"No Xref Accounts to Show"}
        sortColumn={sortData}
      />
    </React.Fragment>
  );
}

export default XrefAccount;
