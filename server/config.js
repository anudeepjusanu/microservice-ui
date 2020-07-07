const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  SNOWFLAKE_URL: "logitech.snowflakecomputing.com",
  SNOWFLAKE_ACCOUNT: "logitech",
  SNOWFLAKE_USERNAME: "CUSTOMER_UI_DEV",
  SNOWFLAKE_PASSWORD: "Cu@tU1D3v",
  SNOWFLAKE_DB: "POS_DEV",
  SNOWFLAKE_SCHEMA: "PRESENTATION",
  v1_base_path: "/api/v1",
  PORT: 3000,
};
