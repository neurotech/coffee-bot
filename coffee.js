const tiny = require("tiny-json-http");
const qs = require("query-string");

function buildCoffeeResponse(payload) {
  // Generate question
  // Get image
  let url = payload.response_url;
  let data = { text: "Coffee anyone?" };
  tiny.post({ url, data }, function(err) {
    if (err) throw err;
  });
}

module.exports = function coffee(request, response, tokens) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(
    JSON.stringify({
      text: `:coffee: Request received. _Please wait..._`
    })
  );
  response.end();

  let payload = "";
  request.on("data", function(data) {
    payload += data;
  });
  request.on("end", function() {
    let parsed = qs.parse(payload);
    buildCoffeeResponse(parsed);
  });
};
