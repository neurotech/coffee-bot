const https = require("https");
const righto = require("righto");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");
const questions = require("./questions");
const log = require("./log");

function makeRequest(settings, callback){
  tiny[settings.method](settings, callback);
}

function getUser(id, callback) {
  let url = `https://slack.com/api/users.profile.get?token=${
    config.slack
  }&user=${id}`;

  var user = righto(makeRequest, { method: 'get', url });
  var profile = user.get('profile');

  profile(callback);
}

function giphy(callback) {
  var url = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;

  var giphyResponse = righto(makeRequest, { method: 'get', url });
  var url = giphyResponse.get(response =>
    response.data.images.downsized_large.url
  );

  url(callback);
}

function buildUserImageResponse(imageUrl, profile){
    let name = (
      profile.display_name_normalized ||
      profile.real_name_normalized
    );
    let question = questions(name);
    let data = {
      response_type: "in_channel",
      attachments: [
        {
          color: "#593C1F",
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
  let imageResponse = righto.sync(buildCoffeeResponse, imageUrl, user);
  let sent = righto(makeRequest, { method: 'post', url });

  sent((error) => {
    error && console.log(error);
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
