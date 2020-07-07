var appController = {};
var _ = require("lodash");
var service = require("../../services");

appController.tierList = tierList;
appController.strategicImportanceList = strategicImportanceList;
appController.attributeTypeList = attributeTypeList;
appController.getCountriesList = getCountriesList;
appController.getRegionsList = getRegionsList;
appController.getClassificationTypesList = getClassificationTypesList;
appController.getClassificationValuesList = getClassificationValuesList;
appController.getChannelGroupingParentsList = getChannelGroupingParentsList;
appController.getIndustryCodesList = getIndustryCodesList;
appController.getT3MasterIdentifiersList = getT3MasterIdentifiersList;
appController.getTransactionTypesList = getTransactionTypesList;
appController.searchFormMetaData = searchFormMetaData;
appController.searchForm = searchForm;

module.exports = appController;

function tierList(req, res) {
  service.goldenAccountService
    .getTierList()
    .then((data) => {
      res.send({ status: true, message: "", tiers: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function strategicImportanceList(req, res) {
  service.goldenAccountService
    .getStrategicImportanceList()
    .then((data) => {
      res.send({ status: true, message: "", strategicImportances: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function attributeTypeList(req, res) {
  service.goldenAccountService
    .getAttributeTypeList(req.query.attrType)
    .then((data) => {
      res.send({ status: true, message: "", attributeValues: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getCountriesList(req, res) {
  service.goldenAccountService
    .getCountriesList()
    .then((data) => {
      res.send({ status: true, message: "", countries: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getRegionsList(req, res) {
  service.goldenAccountService
    .getRegionsList()
    .then((data) => {
      res.send({ status: true, message: "", regions: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getClassificationTypesList(req, res) {
  service.goldenAccountService
    .getClassificationTypesList()
    .then((data) => {
      res.send({ status: true, message: "", classificationTypes: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getClassificationValuesList(req, res) {
  service.goldenAccountService
    .getClassificationValuesList()
    .then((data) => {
      res.send({ status: true, message: "", classificationValues: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getChannelGroupingParentsList(req, res) {
  service.goldenAccountService
    .getChannelGroupingParentsList(req.query)
    .then((data) => {
      res.send({ status: true, message: "", channelGroupingParents: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getIndustryCodesList(req, res) {
  service.goldenAccountService
    .getIndustryCodesList()
    .then((data) => {
      res.send({ status: true, message: "", industryCodes: data });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}

function getT3MasterIdentifiersList(req, res) {
  service.goldenAccountService.getT3MasterIdentifiersList().then((data) => {
    res.send({ status: true, message: "", t3MasterIdentifiers: data });
  }).catch((error) => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function getTransactionTypesList(req, res) {
  service.goldenAccountService.getTransactionTypesList().then((data) => {
    res.send({ status: true, message: "", transactionTypes: data });
  }).catch((error) => {
    res.status(400).send({ status: false, error: error.message });
  });
}

function searchFormMetaData(req, res) {
  service.goldenAccountService.searchFormMetaData().then((data) => {
    data.countries = _.groupBy(data.countries, "REGION");
    data.classificationValues = _.groupBy(
      data.classificationValues,
      "CLASSIFICATION_TYPE"
    );
    res.send({ status: true, message: "", ...data });
  }).catch((error) => {
    res.status(400).send({ status: false, error: error.message });
  });
}

async function searchForm(req, res) {
  var params = req.query;
  params.page = params.page ? params.page : 1;
  params.limit = params.limit ? params.limit : 20;
  params.offset = params.page == 1 ? 0 : parseInt((params.page - 1) * params.limit);
  params.orderField = params.orderField ? params.orderField : "LOGITECH_ACCOUNT_ID";
  params.orderAsc = params.orderAsc == "DESC" ? "DESC" : "ASC";
  var rowsCount = await service.goldenAccountService.getSearchForm(params, true);
  rowsCount = rowsCount[0]["ROW_COUNT"];
  var pagenation = {
    page: params.page,
    limit: params.limit,
    offset: params.offset,
    totalCount: rowsCount,
  };

  service.goldenAccountService
    .getSearchForm(params)
    .then((data) => {
      res.send({ status: true, message: "", data, pagenation });
    })
    .catch((error) => {
      res.status(400).send({ status: false, error: error.message });
    });
}
