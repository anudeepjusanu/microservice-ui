var express = require("express");
var app_route = require("./app_routes");
var golden_account_route = require("./golden_account_routes");
var account_route = require("./account_routes");
var approval_route = require("./approval_routes");

const Router = express.Router();

exports = module.exports = Router;

Router.use("/app", app_route);
Router.use("/goldenAccount", golden_account_route);
Router.use("/account", account_route);
Router.use("/approval", approval_route);