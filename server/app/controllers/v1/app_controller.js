var appController = {};
var service = require("../../services");

appController.Test = Test;

module.exports = appController;

function Test(req, res) {
  res.send("HELLO");
}
