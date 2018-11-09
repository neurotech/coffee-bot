const tiny = require("tiny-json-http");

function buildCoffeeResponse(request) {
  console.log(request);
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
    let slack = JSON.parse(payload);
    buildCoffeeResponse(slack);
  });
};
