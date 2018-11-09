const tiny = require("tiny-json-http");

function buildCoffeeResponse(request, tokens) {
  console.log(tokens);
}

module.exports = function coffee(request, response, tokens) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(
    JSON.stringify({
      text: `:coffee: Request received. _Please wait..._`
    })
  );
  response.end();

  buildCoffeeResponse(request, tokens);
};
