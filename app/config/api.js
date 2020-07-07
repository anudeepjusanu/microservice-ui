import axios from "axios";
import { GLODENACCOUNTSEARCH, ACCOUNTDETAILSURL, APPROVALURL } from './../utils/constants';

const headers = {
    "Content-Type": "application/json;charset=UTF-8"
  };

  
export const SEARCHFORM = axios.create({
    baseURL: GLODENACCOUNTSEARCH,
    headers
  });
  
export const ACCOUNTDETAILS = axios.create({
    baseURL: ACCOUNTDETAILSURL,
    headers
  });

export const PENDINGAPPROVALS = axios.create({
    baseURL: APPROVALURL,
    headers
  });