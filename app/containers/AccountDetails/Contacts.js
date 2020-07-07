import React, { useEffect, useState } from "react";
import { Article, ExportToExcel, Div } from "./AccountDetailsStyles";
import { ContactsColumns } from "components/AccountDetailsTabs";
import { getAccountContacts } from "services/accountDetailsService";
import TableWithPagination from "components/TableWithPagination";
import { ButtonFilled } from "./../../components/Button";
import history from "utils/history";

function Contacts(props) {
  const [accountContacts, setAccountContacts] = useState([]);

  useEffect(() => {
    getAccountContacts(props.goldenAccountId).then((res) => {
      setAccountContacts(res.data);
    });
  }, []);

  const addContact=()=>{
    history.push({pathname : `/newCustomerContacts/${props.goldenAccountId}`, state : { showForm: false }});
  }

  const sortData = (a, b) => {
    let sort = {};
    let order = 'DESC';
    if(a[0].desc){
      order = 'ASC';
    }
    sort.orderField = a[0].id;
    sort.orderAsc = order;
    getAccountContacts(props.goldenAccountId, sort);
  }

  return (
    <React.Fragment>
      <Div>
        <ButtonFilled onButtonClick={(e) => addContact(e)} height="30px">ADD NEW CONTACT</ButtonFilled>
        <ExportToExcel>Export to Excel</ExportToExcel>
      </Div>

      <TableWithPagination
        columns={ContactsColumns}
        data={accountContacts.accountContacts}
        showPagination={false}
        noDataText={"No Contacts to Show"}
        sortColumn={sortData}
      />
    </React.Fragment>
  );
}

export default Contacts;
