const http = require("http");
const SeaLion = require("sea-lion");
const seaLion = new SeaLion();
const coffee = require("./coffee");
const log = require("./log");

seaLion.add({ "/coffee": coffee });

let port = 4567;
let server = http.createServer(seaLion.createHandler());

server.listen(port);
log.info(`Started web server on port ${port}.`);
