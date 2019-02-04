const righto = require("righto");
const tiny = require("tiny-json-http");
const questions = require("./questions");
const log = require("./log");
if (process.env.NODE_ENV === "development") require("dotenv").config();

function makeRequest(settings, callback) {
  tiny[settings.method](settings, callback);
}

function giphy(callback) {
  var url = `https://api.giphy.com/v1/gifs/random?api_key=${
    process.env.COFFEEBOT_GIPHY_KEY
  }&tag=coffee&rating=g`;

  var giphyResponse = righto(makeRequest, { method: "get", url });
  var url = giphyResponse.get(
    response => response.body.data.images.downsized_large.url
  );

  url(callback);
}

function buildUserImageResponse(imageUrl, asker) {
  let palette = ["#2f1600", "#593C1F", "#886647", "#b99473"];
  let question = questions(asker.name);
  let data = {
    response_type: "in_channel",
    attachments: [
      {
        color: palette[Math.floor(Math.random() * palette.length)],
        pretext: question,
        image_url: imageUrl
      }
    ]
  };

  return data;
}

function buildCoffeeResponse(user) {
  let url = process.env.COFFEEBOT_SLACK_WEBHOOK;
  let imageUrl = righto(giphy);
  let asker = user && JSON.parse(user);
  let imageResponse = righto.sync(buildUserImageResponse, imageUrl, asker);
  let sent = righto(
    makeRequest,
    righto.resolve({
      method: "post",
      url: url,
      data: imageResponse
    })
  );

  sent(error => {
    error && log.error(error);
  });
}

module.exports = function coffee(request, response) {
  let defaultHeaders = { "Content-Type": "application/json" };

  response.writeHead(200, defaultHeaders);
  response.write(JSON.stringify({ response: "Success!" }));
  response.end();

  let payload = "";
  request.on("data", data => {
    payload += data;
  });
  request.on("end", () => {
    buildCoffeeResponse(payload);
  });
};
