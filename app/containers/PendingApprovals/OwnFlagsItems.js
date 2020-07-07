import React, { useEffect, memo, useState } from "react";
import CheckBox from "../../components/Checkbox";
import TableWithPagination from "../../components/TableWithPagination";
import { getOwnFlagsData } from "../../services/pendingApprovalService";

function OwnFlagsTable(props) {
  const [approvalData, setApprovalData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    getOwnFlagsData().then((res) => {
      console.log(res);
      setApprovalData(res.data.data);
      const selectAllVar = selectAll;
      let checkedCopy = [];
      res.data.data.forEach(function(e, index) {
        e.isChecked = false;
        checkedCopy.push(e);
      });
      setChecked([...checkedCopy]);
    });
  }, []);

  const handleChange = () => {
    var selectall = !selectAll;
    setSelectAll(selectall);
    var checkedCopy = [];
    approvalData.forEach(function(e, index) {
      e.isChecked = selectall;
      checkedCopy.push(e);
    });
    setChecked([...checkedCopy]);
    selectedAttributes();
  };

  const handleSingleCheckboxChange = (index) => {
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
    props.selectedAttributes(selectedItems);
  };

  const OwnFlagsColumns = [
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
      Header: "Customer Account Id",
      accessor: "ACCOUNT_ID",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "Account Name",
      accessor: "ACCOUNT_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "Current Value",
      accessor: "CURRENTVALUE",
      style: { whiteSpace: "unset" },
      minWidth: 80,
    },
    {
      Header: "New Value",
      accessor: "NEWVALUE",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Start Date",
      accessor: "STARTDATE",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "End Date",
      accessor: "ENDDATE",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Submitted By",
      accessor: "SUBMITTED_BY",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Submitted On",
      accessor: "SUBMITTED_ON",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Submitted Comment",
      accessor: "SUBMITTED_COMMENT",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Approve / Reject Comment",
      accessor: "APPROVED_COMMENT",
      style: { whiteSpace: "unset" },
      minWidth: 90,
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
    getOwnFlagsData(sort);
  };

  return (
    <React.Fragment>
      <TableWithPagination
        columns={OwnFlagsColumns}
        data={approvalData}
        paginationData={0}
        showPagination={false}
        sortColumn={sortData}
      />
      <p>{approvalData.length} records</p>
    </React.Fragment>
  );
}

export default OwnFlagsTable;
