import React, { useEffect, memo, useState } from "react";
import CheckBox from "../../components/Checkbox";
import TableWithPagination from "../../components/TableWithPagination";
import { getXRefGroupingData } from "../../services/pendingApprovalService";

function XRefGroupingTable(props) {
  const [approvalData, setApprovalData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    getXRefGroupingData().then((res) => {
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

  const XRefGroupingColumns = [
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
      Header: "XRef Logitech Id",
      accessor: "XREF_LOGITECH_ID",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "XRef Account ID",
      accessor: "XREF_ACCOUNT_ID",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "XRef Name",
      accessor: "XREF_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 80,
    },
    {
      Header: "Existing Golden Account Name",
      accessor: "EXISTING_GOLDEN_ACCOUNT_NAME",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "New Golden Account Name",
      accessor: "NEW_GOLDEN_ACCOUNT_NAME",
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
      Header: "Submitted Date",
      accessor: "SUBMITTED_ON",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Comments",
      accessor: "SUBMITTED_COMMENT",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
    {
      Header: "Approval / Reject Comment",
      accessor: "APPROVED_COMMENT",
      style: { whiteSpace: "unset" },
      minWidth: 90,
    },
  ];

  const sortData = (a, b) => {
    let sort = {};
    let order = 'DESC';
    if(a[0].desc){
      order = 'ASC';
    }
    sort.orderField = a[0].id;
    sort.orderAsc = order;
    getXRefGroupingData(sort);
  }

  return (
    <React.Fragment>
    <TableWithPagination
      columns={XRefGroupingColumns}
      data={approvalData}
      paginationData={0}
      showPagination={false}
      sortColumn={sortData}
    />
        <p>{approvalData.length} records</p>
    </React.Fragment>
  );
}

export default XRefGroupingTable;
