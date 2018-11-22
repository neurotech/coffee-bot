const https = require("https");
const righto = require("righto");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");
const questions = require("./questions");
const log = require("./log");

function fetch(url, callback) {
  https.get(url, response => {
    if (response.statusCode !== 200) return callback(Error("No image found!"));

    let json = "";
    response.on("data", data => (json += data));
    response.on("end", () => {
      callback(null, JSON.parse(json));
    });
  });
}

function user(id, callback) {
  let url = `https://slack.com/api/users.profile.get?token=${
    config.slack
  }&user=${id}`;

  fetch(url, (err, res) => {
    if (err) callback(err);
    callback(null, res.profile);
  });
}

function giphy(callback) {
  var url = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;

  fetch(url, (err, res) => {
    if (err) callback(err);
    callback(null, res.data.images.downsized_large.url);
  });
}

function buildCoffeeResponse(payload) {
  let url = payload.response_url;
  let imageUrl = righto(giphy);
  let name = righto(user, payload.user_id);
  let combined = righto.mate(imageUrl, name);

  combined(function(error, imageUrl, profile) {
    if (error) log.error(error);
    let name = profile.display_name_normalized
      ? profile.display_name_normalized
      : profile.real_name_normalized;
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

    tiny.post({ url, data }, (err, res) => {
      if (err) log.error(err);
    });
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
