const bcrypt = require("bcryptjs");
const righto = require("righto");

function compare(password, hashed, callback) {
  bcrypt.compare(password, hashed, function(error, valid) {
    return callback(error, valid);
  });
}

function handlePassword(data, callback) {
  var hashedPassword = process.env.COFFEEBOT_HASHED_PASSWORD;
  // var validate = righto(compare, data.password, hashedPassword);

  compare(data.password, hashedPassword, function(error, valid) {
    if (valid) {
      callback(null, { token: "secretz" });
    } else {
      callback("INVALID");
    }
  });
}

module.exports = function login(scope, tokens, data, callback) {
  if (!data.username) {
    return callback("INVALID USERNAME");
  }
  if (!data.password) {
    return callback("INVALID PASSWORD");
  }

  handlePassword(data, callback);
};
