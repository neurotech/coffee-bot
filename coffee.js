const https = require("https");
const tiny = require("tiny-json-http");
const qs = require("query-string");
const config = require("./config");

function getImageFromUrl(url, callback){
    var request = https.get(url, (response) => {
        if (response.statusCode === 302) {
            return callback(null, response.headers["location"]);
        }
        
        if (response.statusCode === 200) {
            let json = "";
            response.on("data", data => {
                json += data;
            });
            response.on("end", () => {
                let gif = JSON.parse(json);
                callback(null, gif.data.images.downsized_large.url);
            });
            return;
        }
        
        callback(Error("No image found!"));
        
    })
    .on('error', callback);
}

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
  getImageFromUrl(randomImageUrl, callback);
}

function giphy(callback) {
  var randomImageUrl = `https://api.giphy.com/v1/gifs/random?api_key=${
    config.giphy
  }&tag=coffee&rating=g`;
  
  getImageFromUrl(randomImageUrl, callback);
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

      response.writeHead(200, { 'Content-Type': 'text/html' });
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
