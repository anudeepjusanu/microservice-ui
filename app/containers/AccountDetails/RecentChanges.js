import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, Div } from "./AccountDetailsStyles";
import { RecentAccountChangesColumns } from "components/AccountDetailsTabs";
import { getRecentAccountChanges } from "services/accountDetailsService";
import TableWithPagination from "components/TableWithPagination";

function RecentChanges(props) {
  const [recentChanges, setRecentAccountChanges] = useState([]);

  useEffect(() => {
    getRecentAccountChanges(props.goldenAccountId).then((res) => {
      setRecentAccountChanges(res.data);
    });
  }, []);

  const sortData = (a, b) => {
    let sort = {};
    let order = 'DESC';
    if(a[0].desc){
      order = 'ASC';
    }
    sort.orderField = a[0].id;
    sort.orderAsc = order;
    console.log(sort)
    getRecentAccountChanges(props.goldenAccountId, sort);
  }

  return (
    <React.Fragment>
      <ExportToExcel>Export to Excel</ExportToExcel>
      <TableWithPagination
        columns={RecentAccountChangesColumns}
        data={recentChanges.recentAccountChanges}
        showPagination={false}
        noDataText={"No Recent Changes to Show"}
        sortColumn={sortData}
      />
    </React.Fragment>
  );
}

export default RecentChanges;
