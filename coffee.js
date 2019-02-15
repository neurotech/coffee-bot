const righto = require("righto");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const questions = require("./questions");
const log = require("./log");
if (process.env.NODE_ENV === "development") require("dotenv").config();

function makeRequest(settings, callback) {
  tiny[settings.method](settings, callback);
}

function getUser(id, callback) {
  let key = process.env.COFFEEBOT_SLACK_KEY;
  let url = `https://slack.com/api/users.profile.get?token=${key}&user=${id}`;

  var userResponse = righto(makeRequest, { method: "get", url });
  var profile = userResponse.get(response => response.body.profile);

  profile(callback);
}

function giphy(callback) {
  let key = process.env.COFFEEBOT_GIPHY_KEY;
  var url = `https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=coffee&rating=g`;

  var giphyResponse = righto(makeRequest, { method: "get", url });
  var url = giphyResponse.get(
    response => response.body.data.images.downsized_large.url
  );

  url(callback);
}

function buildUserImageResponse(imageUrl, profile) {
  let palette = ["#2f1600", "#593C1F", "#886647", "#b99473"];
  let name = profile.display_name_normalized || profile.real_name_normalized;
  let question = questions(name);
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

function buildCoffeeResponse(payload) {
  let url = payload.response_url;
  let imageUrl = righto(giphy);
  let user = righto(getUser, payload.user_id);
  let imageResponse = righto.sync(buildUserImageResponse, imageUrl, user);
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
  response.writeHead(200);
  response.write("");
  response.end();

  let payload = "";
  request.on("data", data => {
    payload += data;
  });
  request.on("end", () => {
    let parsed = qs.parse(payload);
    buildCoffeeResponse(parsed);
  });
};
