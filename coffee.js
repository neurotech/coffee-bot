const https = require("https");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");

function getQuestion() {
  let questions = [
    "Coffee anyone?",
    "Anyone for coffee?",
    ":coffee: anyone?",
    "Anyone for ｃｏｆｆｅｅ?",
    "ｃｏｆｆｅｅ anyone?",
    "Coffee time, anyone interested?",
    "COFFEE who's interested?"
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

function unsplash(callback) {
  var randomImageUrl = "https://source.unsplash.com/800x600/?coffee";
  https.get(randomImageUrl, res => {
    if (res.statusCode === 302) {
      callback(null, res.headers["location"]);
    } else {
      callback(Error("No image found!"));
    }
  });
}

function giphy(callback) {
  var randomImageUrl = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;
  https.get(randomImageUrl, res => {
    if (res.statusCode === 200) {
      let json = "";
      res.on("data", data => {
        json += data;
      });
      res.on("end", () => {
        let gif = JSON.parse(json);
        callback(null, gif.data.images.downsized_large.url);
      });
    } else {
      callback(Error("No image found!"));
    }
  });
}

function getRandomImage(callback) {
  let providers = [unsplash, giphy];
  let getImage = providers[Math.floor(Math.random() * providers.length)];

  getImage(callback);  
}

function buildCoffeeResponse(payload) {
  getRandomImage(function(err, res) {
    if (err) throw err;
    let url = payload.response_url;
    let imageUrl = res;
    let data = {
      response_type: "in_channel",
      attachments: [
        {
          color: "#593C1F",
          pretext: getQuestion(),
          image_url: imageUrl
        }
      ]
    };
    tiny.post({ url, data }, function(err) {
      if (err) throw err;
    });
  });
}

function handleGet(request, response){
    getRandomImage(function(error, imageUrl){
      if (error) {
        response.writeHead(500);
        response.end('An error occured');
        return;
      }

      response.writeHead(200, 'text/html');
      response.end(`<img src="${imageUrl}"></img>`);
    });
}

module.exports = function coffee(request, response) {
  let method = request.method;
  
  if (method === 'GET') {
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
