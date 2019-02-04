const cpjax = require("cpjax");

module.exports = {
  ask: function askQuestion(token, user, callback) {
    cpjax(
      {
        url: `/coffee`,
        method: "POST",
        auth: `Bearer ${token}`,
        json: true,
        data: user && JSON.stringify({ name: user })
      },
      function(error, data) {
        callback(error, data);
      }
    );
  },
  login: function postLogin(login, callback) {
    var credentials = { username: login.username, password: login.password };
    cpjax(
      {
        url: "/login",
        method: "POST",
        json: true,
        data: JSON.stringify(credentials)
      },
      function(error, data) {
        callback(error, data);
      }
    );
  }
};
