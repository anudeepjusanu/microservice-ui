const config = require("../../config");
const snowflake = require("snowflake-sdk");
var coreService = {
  connection: null,
  connection_id: null,
  statement: null,
};

coreService.startConnect = () => {
  return new Promise((resolve, reject) => {
    coreService.connection = snowflake.createConnection({
      account: config.SNOWFLAKE_ACCOUNT,
      username: config.SNOWFLAKE_USERNAME,
      password: config.SNOWFLAKE_PASSWORD,
      // clientSessionKeepAlive: true,
      // clientSessionKeepAliveHeartbeatFrequency: 3600,
    });

    coreService.connection.connect(function (err, conn) {
      if (err) {
        console.error("Unable to connect: " + err.message);
        console.log(err);
        reject(err.message);
      } else {
        console.log("Successfully connected to Snowflake.");
        console.log(conn.getId());
        resolve(conn.getId());
      }
    });
  });
};

coreService.checkConnect = async () => {
  if (!coreService.connection.isUp()) {
    await coreService.startConnect();
  }
};

coreService.stopConnect = () => { };

coreService.cancelExecute = () => {
  coreService.statement.cancel(function (err, stmt) {
    if (err) {
      console.error(
        "Unable to abort statement due to the following error: " + err.message
      );
    } else {
      console.log("Successfully aborted statement");
    }
  });
};

coreService.execute = async (sqlText, bindData = []) => {
  return new Promise(async (resolve, reject) => {
    if (!coreService.connection.isUp()) {
      await coreService.startConnect();
      console.log("Reconnected...........");
    }
    coreService.statement = coreService.connection.execute({
      sqlText: sqlText,
      //binds: bindData,
      complete: function (err, stmt, rows) {
        if (err) {
          console.log(err);
          console.log(stmt.getSqlText());
          console.error("Failed to execute statement due to the following error: " + err.message);
          //coreService.checkConnect();
          reject(err);
        } else {
          console.log("Successfully executed statement: " + stmt.getSqlText());
          resolve(rows);
        }
      },
    });
  });
};

coreService.calPagenationValues = async (params) => {
  params.page = (params.page) ? params.page : 1;
  params.limit = (params.limit) ? params.limit : 20;
  params.offset = (params.page == 1) ? 0 : (parseInt((params.page - 1) * params.limit));
  return params;
};

coreService.getPagenationObj = async (params, rowsCount) => {
  return { page: params.page, limit: params.limit, offset: params.offset, totalCount: rowsCount };;
};

coreService.startConnect();

module.exports = coreService;