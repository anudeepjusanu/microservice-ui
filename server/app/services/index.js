const snowflakeCoreService = require("./snowflake_core_service");
const goldenAccountService = require("./golden_account_service");
const accountService = require("./account_service");
const approvalService = require("./approval_service");

module.exports = {
    snowflakeCoreService: snowflakeCoreService,
    goldenAccountService: goldenAccountService,
    accountService: accountService,
    approvalService: approvalService,
};
