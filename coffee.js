const https = require("https");
const tiny = require("tiny-json-http");
const qs = require("query-string");

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

function getImage(callback) {
  var randomImageUrl = "https://source.unsplash.com/800x600/?coffee";
  https.get(randomImageUrl, res => {
    if (res.statusCode === 302) {
      callback(null, res.headers["location"]);
    } else {
      callback(Error("No image found!"));
    }
  });
}

function buildCoffeeResponse(payload) {
  // Get image
  getImage(function(err, res) {
    if (err) throw err;
    let url = payload.response_url;
    let imageUrl = res;
    let data = {
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
    let parsed = qs.parse(payload);
    buildCoffeeResponse(parsed);
  });
};
