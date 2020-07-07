import React from "react";
import styled from "styled-components";
import Pagination from "./pagination";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles.css";

function TableWithPagination(props) {
 // const onRowClick = (state, rowInfo) => {
    // return {
    //     onClick: e => {
            // console.log('A Td Element was clicked!', state)
            // console.log('A Td Element was clicked!333333333333', rowInfo)

            // console.log('it produced this event:', e)
            // console.log('It was in this column:', column)
            // console.log('It was in this row:', rowInfo)
            // console.log('It was in this table instance:', instance)
    //     }
    // }
//}
  return (
    <React.Fragment>
      <ReactTable
        PaginationComponent={Pagination}
        totalRows={props.paginationData}
        data={props.data}
        columns={props.columns}
        minRows={0}
        showPaginationBottom={true}
        onPageChange={(e) => props.pageChange(e + 1)}
        manual
        noDataText={props.noDataText || "No golden accounts to show..."}
        showPagination={props.showPagination}
        className={props.customCls}
        onSortedChange={props.sortColumn}
      />
      {!props.showPagination && <hr style={{ margin: "30px 0 0 0" }} />}
    </React.Fragment>
  );
}

export default TableWithPagination;
