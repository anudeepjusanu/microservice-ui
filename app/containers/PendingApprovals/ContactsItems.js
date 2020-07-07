import React, { useEffect, memo, useState } from "react";
import CheckBox from "../../components/Checkbox";
import TableWithPagination from "../../components/TableWithPagination";
import { getContactsData } from "../../services/pendingApprovalService";

function ContactsTable(props) {
  const [approvalData, setApprovalData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    getContactsData().then((res) => {
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

  const ContactsColumns = [
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
      Header: "Attribute Type",
      accessor: "ATTRIBUTE_TYPE",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "New Value",
      accessor: "NEWVALUE",
      style: { whiteSpace: "unset" },
      minWidth: 110,
    },
    {
      Header: "Start Date",
      accessor: "STARTDATE",
      style: { whiteSpace: "unset" },
      minWidth: 80,
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
      Header: "Submitted Date",
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
      Header: "Approved/Rejected Comments",
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
    getContactsData(sort);
  }

  return (
    <React.Fragment>
    <TableWithPagination
      columns={ContactsColumns}
      data={approvalData}
      paginationData={0}
      showPagination={false}
      sortColumn={sortData}
    />
    <p>{approvalData.length} records</p>
    </React.Fragment>
  );
}

export default ContactsTable;
