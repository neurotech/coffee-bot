const http = require("http");
const SeaLion = require("sea-lion");
const Dion = require("dion");
const seaLion = new SeaLion();
const dion = new Dion(seaLion);
const requestData = require("request-data");
const responseHandler = require("./response-handler");
const login = require("./login");
const coffee = require("./coffee");
const log = require("./log");

let mimeTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".map": "application/octet-stream",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".ttf": "application/octet-stream"
};

seaLion.add({
  "/": {
    GET: dion.serveFile("./build/index.html", "text/html")
  },
  "/`path...`": {
    GET: dion.serveDirectory("./build", mimeTypes)
  },
  "/login": {
    POST: requestData(responseHandler(login))
  },
  "/coffee": {
    POST: coffee
  }
});

let port = 4567;
let server = http.createServer(seaLion.createHandler());

server.listen(port);
log.info(`Started web server on port ${port}.`);
