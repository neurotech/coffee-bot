const https = require("https");
const righto = require("righto");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");
const log = require("./log");

righto._debug = true;
righto._autotraceOnError = true;

function getImageFromUrl(url, callback) {
  https.get(url, callback.bind(null, null)).on("error", callback);
}

function getQuestion(userName) {
  let questions = [
    "Anyone for coffee?",
    "Anyone for ｃｏｆｆｅｅ?",
    "Coffee anyone?",
    "ｃｏｆｆｅｅ anyone?",
    "Coffee time, anyone interested?",
    "COFFEE who's interested?",
    ":coffee: anyone?",
    ":coffee:?",
    ":coffee: :coffee: :coffee:?"
  ];
  return `*${userName}* asks: ${
    questions[Math.floor(Math.random() * questions.length)]
  }`;
}

function unsplash(callback) {
  var randomImageUrl = "https://source.unsplash.com/800x600/?coffee";
  var response = righto(getImageFromUrl, randomImageUrl);
  var result = response.get(response => {
    if (response.statusCode === 302) {
      return response.headers["location"];
    }

    return righto.fail(Error("No image found!"));
  });

  result(callback);
}

function getGiphyRedirectUrl(response, callback) {
  if (response.statusCode !== 200) {
    return callback(Error("No image found!"));
  }

  let json = "";
  response.on("data", data => (json += data));
  response.on("end", () =>
    callback(null, JSON.parse(json).data.images.downsized_large.url)
  );
}

function giphy(callback) {
  var randomImageUrl = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;
  var response = righto(getImageFromUrl, randomImageUrl);
  var result = righto(getGiphyRedirectUrl, response);

  result(callback);
}

function getRandomImage(callback) {
  let providers = [unsplash, giphy];
  let getImage = providers[Math.floor(Math.random() * providers.length)];

  getImage(callback);
}

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
  var imageUrl = righto(getRandomImage);
  var question = righto(getQuestion, userName);

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
    if (error) {
      console.error(error);
    }
  });
}

function handleGet(request, response) {
  getRandomImage(function(error, imageUrl) {
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
