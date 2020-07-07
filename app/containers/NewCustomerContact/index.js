import React, { useState, useEffect, useRef } from "react";
import { Title, Center, Back, FormLayout, FormColumn, FormField, Label, CommentBoxBtton, Comment, SearchButton, Textarea} from './ContactStyles';
import { ButtonOutLine, ButtonFilled } from "./../../components/Button";
import history from 'utils/history';
import Input from "./../../components/Input";
import SelectBox from "components/Select";
import DatePicker from "./../../components/Datepicker";
import './Contact.css';
import { format } from "date-fns";
import { saveContact } from "./../../services/accountDetailsService";

function NewCustomerContact(props) {

  const childRef1 = useRef();
  const childRef2 = useRef();

  useEffect(()=>{
    if(props.location.state && props.location.state.contact){
      setReadOnly(true);
      let contact = props.location.state.contact;
      setFirstName(contact.FIRST_NAME || '');
      setLastname(contact.LAST_NAME || '');
      setMiddleName(contact.MIDDLE_NAME || '');
      setEmployeeId(contact.EMPLOYEE_ID || '');
      setPhoneNumber(contact.PHONE_NO || '');
      setEmailAddress(contact.emailAddress || '');
      setStatus(contact.STATUS || '');
      setJobTitle(contact.JOB_TITLE || '');
      setEmployeeType(contact.EMPLOYEE_TYPE || '');
      setContactType(contact.CONTACT_TYPE || '');
      setContactId(contact.CONTACT_ID || '');
    }
  },[]);
  

  const [showForm, setFormState] = useState(props.location.state.showForm || false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [status, setStatus] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [comment, setComment] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [ManagerFlag, setManagerFlag] = useState('');
  const [PrimaryManagerFlag, setPrimaryManagerFlag] = useState('');
  const [contactType, setContactType] = useState('');
  const [collectorFlag, setCollectorFlag] = useState('');
  const [effStartDate, setEffStartDate] = useState('');
  const [effEndDate, setEffEndDate] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [contactId, setContactId] = useState(false);

  const searchContact = () =>{
    history.push(`/CustomerContactSearch/${props.match.params.id}`);
  }

  const options = [
    { value: '-', label: '-' },
      { value: 1, label: 'YES' },
      { value: 0, label: 'NO' },
    ];

    const contactTypeOptions = [
      { value: '-', label: '-' },
        { value: 'INTERNAL', label: 'INTERNAL' },
        { value: 'EXTERNAL', label: 'EXTERNAL' },
      ];

    const fnComment=(e)=>{
      setComment(e.target.value)
    }

    const save = () => {

    let req =  {
       // "CONTACT_ID": "118276001102049",
        "FIRST_NAME": firstName,
        "MIDDLE_NAME": middleName,
        "LAST_NAME": lastName,
        "CONTACT_TYPE": contactType,
        "STATUS": status,
        "EMPLOYEE_ID": employeeId,
        "EMPLOYEE_TYPE": employeeType,
        "JOB_TITLE": jobTitle,
        "EMAIL_ADDRESS": emailAddress,
        "PHONE_NO": phoneNumber,
        "COLLECTOR_FLAG": collectorFlag ,
        "SALES_REP_FLAG": "",
        "EFF_START_DATE": effStartDate,
        "EFF_END_DATE": effEndDate,
        "ISREJECTED": "",
        "ISAPPROVED": "",
        "SUBMITTED_BY": "",
        "SUBMITTED_DATE": "",
        "SUBMITTED_COMMENT": comment,
        "SOURCE_SYSTEM_REFERENCE_TYPE": "",
        "SOURCE_SYSTEM_REFERENCE": "",
        "SOURCE_SYSTEM_NAME": "",
        "MANAGER_FLAG": ManagerFlag,
        "CUSTOMER_CONTACTS_PKEY": "",
        "GOLDEN_ACCOUNT_ID": props.match.params.id,
        "CURRENT_VERSION_FLAG": "",
        "ACTION_TYPE": "",
        "LOGITECH_ACCOUNT_ID": "",
        "PRIMARY_MANAGER_FLAG": PrimaryManagerFlag,
        "CREATED_BY": ""
      }
      saveContact(req).then(res=>{
        history.push(`/Account_details/${props.match.params.id}`);
      });
    }

    const goBack = () => {
      history.push({pathname : `/Account_details/${props.match.params.id}`});
    }

    const clearPage = () => {
      setFirstName('');
      setLastname('');
      setMiddleName('');
      setEmployeeId('');
      setEmployeeType('');
      setPhoneNumber('');
      setEmailAddress('');
      setStatus('');
      setJobTitle('');
      setFormState(false);
    }
    const clicked=(e)=>{
        if(childRef1.current){
          childRef1.current.closeCalendar();
        }
         if(childRef2.current){
          childRef2.current.closeCalendar();
         }
    }

    const clicked1 = (e) => {
      console.log("CLICKED1");
      e.stopPropagation()
    }
  
    const clicked2 = (e) => {
      console.log("CLICKED2");
      e.stopPropagation()
    }

    return (
        <div onClick={(e)=>clicked(e)}>
          <Title>New Customer Contact</Title>
          <Center>
          <ButtonOutLine onButtonClick={(e) => searchContact(e)}>search existing contacts</ButtonOutLine>
          </Center>
          {showForm && <FormLayout>
          <FormColumn>
          <FormField>
            <Label>First Name*</Label>
            <Input
              value={firstName}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={e=>setFirstName(e.target.value)}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Last Name*</Label>
            <Input
              value={lastName}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={e=>setLastname(e.target.value)}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Middle Name</Label>
            <Input
              value={middleName}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={e=>setMiddleName(e.target.value)}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Employee Id</Label>
            <Input
              value={employeeId}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={e=>setEmployeeId(e.target.value)}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Employee Type</Label>
            <Input
              value={employeeType}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setEmployeeType}
              disabled={readOnly}
            />
          </FormField>
        </FormColumn>
        <FormColumn>
          <FormField>
            <Label>Phone No</Label>
            <Input
              value={phoneNumber}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setPhoneNumber}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Email Address</Label>
            <Input
              value={emailAddress}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setEmailAddress}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Status</Label>
            <Input
              value={status}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setStatus}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Job Title</Label>
            <Input
              value={jobTitle}
              width="200px"
              clearText={() => clearField("accountNumber")}
              onTextChange={setJobTitle}
              disabled={readOnly}
            />
          </FormField>
          <FormField>
            <Label>Manager</Label>
            <div className="selectBox">
            <SelectBox
            data={options}
            onSelect={(e)=>setManagerFlag(e.value)}
            id="ManagerFlag"
            //defaultOption={""}
          />
            </div>
          </FormField>

          <FormField>
            <Label>Primary Manager</Label>
            <div className="selectBox">
            <SelectBox
            data={options}
            onSelect={(e)=>setPrimaryManagerFlag(e.value)}
            id="ManagerFlag"
            //defaultOption={""}
          />
          </div>
          </FormField>

        </FormColumn>
        <FormColumn>
          <FormField>
            <Label>Contact Type*</Label>
            <div className="selectBox">
            <SelectBox
            data={contactTypeOptions}
            onSelect={(e)=>setContactType(e.value)}
            id="contactType"
            //defaultOption={""}
          />
          </div>
          </FormField>
          <FormField>
            <Label>Representative Collector</Label>
            <div className="selectBox">
            <SelectBox
            data={options}
            onSelect={(e)=>setCollectorFlag(e.value)}
            id="collector"
            //defaultOption={""}
          />
          </div>
          </FormField>
          <FormField>
            <Label>Eff Start Date*</Label>
            <div className="selectBox" onClick={(e)=> clicked1(e)}>
            <DatePicker
              value={format(new Date(), "MM-dd-yyyy")}
              onChange={(value) => {
                setEffStartDate(value)
              }}
              ref={childRef1}
            />
            </div>
          </FormField>
          <FormField>
            <Label>Eff End Date*</Label>
            <div className="selectBox" onClick={(e)=> clicked2(e)}>
            <DatePicker
              value={format(new Date(), "MM-dd-yyyy")}
              onChange={(value) => {
                setEffEndDate(value)
              }}
              ref={childRef2}

            />
            </div>
          </FormField>
        </FormColumn>
          </FormLayout>}
          {showForm && <CommentBoxBtton onClick={(e)=>clicked(e)}>
            <Comment>
              <Label>Submit Comment</Label>
              <Textarea onChange={fnComment} value={comment}></Textarea>
            </Comment>
            <SearchButton>
            <ButtonFilled onButtonClick={()=>save()}>Save</ButtonFilled>
            <ButtonOutLine onButtonClick={()=>clearPage()}>Clear</ButtonOutLine>
          </SearchButton>
          </CommentBoxBtton> }
          <Back>
          <ButtonOutLine onButtonClick={goBack}>Back</ButtonOutLine>
          </Back>
        </div>
      );
}

export default NewCustomerContact;