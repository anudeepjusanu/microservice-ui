import React,{ useEffect, useState } from "react";
import { Title, AddContactButton, Label, FormColumn, FormField, Article, FormLayout, SearchButton, BackButton} from './CustomerContactStyles';
import { ButtonFilled, ButtonOutLine } from "./../../components/Button";
import TableWithPagination from "components/TableWithPagination";
import Input from "./../../components/Input";
import history from 'utils/history';
import { searchContacts } from './../../services/accountDetailsService';

function CustomerContactSearch(props) {
  const [firstName, setFirstName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setmiddleName] = useState('');
  const [contacts, setContacts] = useState([]);
  
    useEffect(()=>{},[]);

    const searchContact = (sort) => {
      console.log(props)
      let req = {
        goldenAccountId: props.match.params.id,
        employeeID: employeeId,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName
      }
      if(sort){
        req.orderField = sort.orderField,
        req.orderAsc = sort.orderAsc
      }
      searchContacts(req).then((res)=>{
        setContacts(res.data.accountContacts);
      });
    };

    const fnFirstName = (e) => {
      setFirstName(e.target.value);
    }

    const fnEmployeeId = (e) => {
      setEmployeeId(e.target.value);
    }

    const fnLastName = (e) => {
      setLastName(e.target.value);
    }

    const fnMiddleName = (e) => {
      setmiddleName(e.target.value);
    }

    const navigateToDetailPage = (r) => {
      history.push({pathname: `/newCustomerContacts/${props.match.params.id}`, state : {contact:r, showForm: true}});
    }

    const columns = [
            {
                Header: "Contact Id",
                accessor: "CONTACT_ID",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Linked Accounts",
                accessor: "GOLDEN_ACCOUNT_NAME",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "First Name",
                accessor: "FIRST_NAME",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Middle Name",
                accessor: "MIDDLE_NAME",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Last Name",
                accessor: "LAST_NAME",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Employee_ID",
                accessor: "EMPLOYEE_ID",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Contact Type",
                accessor: "CONTACT_TYPE",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Status",
                accessor: "STATUS",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Employee Type",
                accessor: "EMPLOYEE_TYPE",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Job Title",
                accessor: "JOB_TITLE",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Email Address",
                accessor: "EMAIL_ADDRESS",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Phone No",
                accessor: "PHONE_NO",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "Sales Rep Flag",
                accessor: "SALES_REP_FLAG",
                style: { whiteSpace: "unset" }
            },
            {
                Header: "",
                accessor: "",
                style: { whiteSpace: "unset" },
                minWidth: 150,
                Cell: (row) => (
                  <ButtonOutLine onButtonClick={() => navigateToDetailPage(row.original)}>Assign</ButtonOutLine>
                ),
              }
        ];
        const AddContact = () => {
          history.push({pathname : `/newCustomerContacts/${props.match.params.id}`, state : { showForm: true }});
        }
    
        const resetPage = () => {
          setFirstName('');
          setEmployeeId('');
          setLastName('');
          setmiddleName('');
          setContacts([]);
        }

        const goBack = () => {
          history.push({pathname : `/Account_details/${props.match.params.id}`});
        }

        const sortData = (a, b) => {
          console.log(a.desc);
          let sort = {};
          let order = 'DESC';
          if(a[0].desc){
            order = 'ASC';
          }
          sort.orderField = a[0].id;
          sort.orderAsc = order;
          searchContact(sort);
        }

    return (
        <div>
          <Title>Customer Contact Search</Title>
          <AddContactButton>
          <ButtonFilled onButtonClick={(e) => AddContact(e)}>ADD New contact</ButtonFilled>
          </AddContactButton>
          <Article>
          <FormLayout>
          <FormColumn>
          <FormField>
            <Label>First Name</Label>
            <Input
              width="400px"
              value={firstName}
              clearText={() => clearField("firstName")}
              onTextChange={fnFirstName}
              showClearIcon={false}
            />
          </FormField>
          <FormField>
            <Label>Employee ID</Label>
            <Input
              value={employeeId}
              width="200px"
              clearText={() => clearField("employeeId")}
              onTextChange={fnEmployeeId}
              showClearIcon={false}
            />
          </FormField>
        </FormColumn>
        <FormColumn>
          <FormField>
            <Label>Last Name</Label>
            <Input
              width="400px"
              value={lastName}
              clearText={() => clearField("lastName")}
              onTextChange={fnLastName}
              showClearIcon={false}
            />
          </FormField>
          <FormField>
            <Label>Middle Name</Label>
            <Input
              value={middleName}
              width="400px"
              clearText={() => clearField("middleName")}
              onTextChange={fnMiddleName}
              showClearIcon={false}
            />
          </FormField>
        </FormColumn>
        </FormLayout>
        <SearchButton>
        <ButtonOutLine onButtonClick={searchContact}>search</ButtonOutLine>
        <ButtonOutLine onButtonClick={resetPage}>reset</ButtonOutLine>
        </SearchButton>
        
          </Article>
          <TableWithPagination
          columns={columns}
          data={contacts}
          paginationData={0}
          showPagination={true}
          sortColumn={sortData}
          //pageChange={(page) => sendSearchRequest(request, page, false)}
        />
        <BackButton>
        <ButtonOutLine onButtonClick={goBack}>back</ButtonOutLine>
        </BackButton>
        </div>
      );
}

export default CustomerContactSearch;