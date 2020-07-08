/* eslint consistent-return:0 import/order:0 */

const express = require("express");
const logger = require("./logger");
var bodyParser = require("body-parser");
var cors = require("cors");
const argv = require("./argv");
const port = require("./port");
const setup = require("./middlewares/frontendMiddleware");
const isDev = process.env.NODE_ENV !== "production";
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require("ngrok")
    : false;
var helmet = require("helmet");
var Router = require("./app/routes/index");
var rfs = require("rotating-file-stream");
var path = require("path");
var morganBody = require("morgan-body");
var { SNOWFLAKE_URL, v1_base_path, PORT } = require("./config");

const app = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         fontSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
//         styleSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
//       },
//     },
//     frameguard: { action: "deny" },
//     noCache: true,
//   })
// );

function authenticationRequired(req, res, next) {
  next();
}

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

app.use(bodyParser.json()); //parsing request body
morganBody(app);
morganBody(app, { stream: accessLogStream, noColors: true });
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); //parsing request queries
// Setting up request headers to support Angular applications
app.use(v1_base_path, express.static("build"));

app.use(
  cors({
    origin: "*",
    exposedHeaders: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    methods: "GET,PUT,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get("/health", (req, res) => {
  res.json({
    message: "Success!!!",
  });
});
app.get("/oauth/redirect", (req, res) => {
  console.log(req);
  res.json({
    messages: "Redirect end point",
  });
});
app.get("/security", authenticationRequired, (req, res) => {
  res.json({
    message: "Success!!!",
  });
});

app.use(v1_base_path, authenticationRequired, Router);

app.use(function(err, req, res, next) {
  console.log(err, err);
  err.code = err.code && err.code <= 600 ? err.code : 500;
  res.status(err.code || 500).json({
    error: err.name,
    error_description: err.message,
  });
});

setup(app, {
  outputPath: path.resolve(process.cwd(), "build"),
  publicPath: "/",
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || "localhost";

// use the gzipped bundle
app.get("*.js", (req, res, next) => {
  req.url = req.url + ".gz"; // eslint-disable-line
  res.set("Content-Encoding", "gzip");
  next();
});

console.log(
  JSON.stringify({
    SNOWFLAKE_URL,
  })
);

// Start your app.
app.listen(port, host, async (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
