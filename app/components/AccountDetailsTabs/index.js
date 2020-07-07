import React, { useEffect, useState } from "react";
import TableWithPagination from "components/TableWithPagination";
import { ExportToExcel } from "./AccountDetailsTabStyles";

export const TabHeadings = [
  { id: 1, name: "Recent Account Changes" },
  { id: 2, name: "XRef Accounts" },
  { id: 3, name: "XRef Account Sites" },
  { id: 4, name: "Account Classification" },
  { id: 5, name: "Reporting" },
  { id: 6, name: "Account Contacts" },
];

export const RecentAccountChangesColumns = [
  {
    Header: "Attribute Name",
    accessor: "ATTRIBUTE",
    style: { whiteSpace: "unset" },
    minWidth: 90,
  },
  {
    Header: "Current Value",
    accessor: "CURRENTVALUE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Previous Value",
    accessor: "PREVIOUSVALUE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Submitted Date",
    accessor: "SUBMITTED_DATE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Submitted By",
    accessor: "SUBMITTED_BY",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Approved Date",
    accessor: "APPROVED_DATE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Approved By",
    accessor: "APPROVED_BY",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
];

export const XRefAccountColumns = [
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


export const ContactsColumns = [
  {
    Header: "Contact Id",
    accessor: "CONTACT_ID",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "First Name",
    accessor: "FIRST_NAME",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Last Name",
    accessor: "LAST_NAME",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Employee ID",
    accessor: "EMPLOYEE_ID",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Job Title",
    accessor: "JOB_TITLE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Account Manager",
    accessor: "MANAGER_FLAG",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Primary Manager",
    accessor: "PRIMARY_MANAGER_FLAG",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "Start Date",
    accessor: "EFF_START_DATE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
  {
    Header: "End Date",
    accessor: "EFF_END_DATE",
    style: { whiteSpace: "unset" },
    minWidth: 100,
  },
];
