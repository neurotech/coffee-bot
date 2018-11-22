const https = require("https");
const righto = require("righto");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");
const questions = require("./questions");
const log = require("./log");

function user(id, callback) {
  let url = `https://slack.com/api/users.profile.get?token=${
    config.slack
  }&user=${id}`;

  https.get(url, response => {
    if (response.statusCode !== 200) return callback(Error("No image found!"));

    let json = "";
    response.on("data", data => (json += data));
    response.on("end", () => {
      callback(null, JSON.parse(json).profile);
    });
  });
}

function giphy(callback) {
  var url = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;
  https.get(url, response => {
    if (response.statusCode !== 200) return callback(Error("No image found!"));

    let json = "";
    response.on("data", data => (json += data));
    response.on("end", () => {
      callback(null, JSON.parse(json).data.images.downsized_large.url);
    });
  });
}

function buildCoffeeResponse(payload) {
  let url = payload.response_url;
  let imageUrl = righto(giphy);
  let name = righto(user, payload.user_id);
  let combined = righto.mate(imageUrl, name);

  combined(function(error, imageUrl, profile) {
    if (error) console.error(error);
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
      if (err) console.error(err);
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

/*
function getUserInfo(id, callback) {
  let url = `https://slack.com/api/users.profile.get?token=${
    config.slack
  }&user=${id}`;

  var profile = righto(tiny.get.bind(tiny), { url })
    .get("body")
    .get("profile");
  profile(callback);
}

function buildCoffeeResponse(payload) {
  let url = payload.response_url;
  var userInfo = righto(getUserInfo, payload.user_id);
  var userName = userInfo.get(
    info => info.display_name_normalized || info.real_name_normalized
  );
  var imageUrl = righto(giphy);
  var question = righto(questions, userName);

  let data = righto.resolve(
    {
      response_type: "in_channel",
      attachments: [
        {
          color: "#593C1F",
          pretext: question,
          image_url: imageUrl
        }
      ]
    },
    true
  );

  var posted = righto(tiny.post.bind(tiny), righto.resolve({ url, data }));

  posted(function(error) {
    if (error) console.error(error);

    console.log("BLAH");
  });
}

function handleGet(request, response) {
  giphy(function(error, imageUrl) {
    if (error) {
      log.error(error);
      response.writeHead(500);
      response.end("An error occured");
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(`<img src="${imageUrl}"></img>`);
  });
}

module.exports = function coffee(request, response) {
  let method = request.method;

  if (method === "GET") {
    return handleGet(request, response);
  }

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
*/
