import { PENDINGAPPROVALS } from "config/api";

export const getAttributeData = (req={}) => {
  return PENDINGAPPROVALS.get("/attributes",{
    params: {
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined
    },
  });
};

export const approveItems = (data, type) => {
  let url = "";
  switch (type) {
    case "Attributes":
      url = "approvePendingAttributes";
      break;
    case "LOVs":
      url = "approvePendingListOfValues";
      break;
    case "OwnFlags":
      url = "approvePendingOwnFlags";
      break;
    case "XRefGrouping":
      url = "approvePendingXrefGroupings";
      break;
    case "Contacts":
      url = "approvePendingContacts";
      break;
  }
  return PENDINGAPPROVALS.put(`/${url}`, data);
};

export const rejectItems = (data, type) => {
  let url = "";
  switch (type) {
    case "Attributes":
      url = "rejectPendingAttributes";
      break;
    case "LOVs":
      url = "rejectPendingListOfValues";
      break;
    case "OwnFlags":
      url = "rejectPendingOwnFlags";
      break;
    case "XRefGrouping":
      url = "rejectPendingXrefGroupings";
      break;
    case "Contacts":
      url = "rejectPendingContacts";
      break;
  }
  return PENDINGAPPROVALS.put(`/${url}`, data);
};

export const getLovsData = (req={}) => {
  return PENDINGAPPROVALS.get("/pendingListOfValues",{
    params: {
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined
    },
  });
};

export const getOwnFlagsData = (req={}) => {
  return PENDINGAPPROVALS.get("/pendingOwnFlags",{
    params: {
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined
    },
  });
};

export const getContactsData = () => {
  return PENDINGAPPROVALS.get("/pendingContacts");
};

export const getXRefGroupingData = (req={}) => {
  return PENDINGAPPROVALS.get("/pendingXrefGroupings",{
    params: {
      orderField: req.orderField ? req.orderField : undefined,
      orderAsc: req.orderAsc ? req.orderAsc : undefined
    },
  });
};
