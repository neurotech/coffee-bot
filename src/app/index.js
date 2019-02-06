const api = require("../api");

module.exports = function(fastn, state) {
  function loading(fn) {
    app.setLoading(true);
    return function() {
      var args = Array.from(arguments);
      var callback = args.pop();
      fn.apply(
        null,
        args.concat(function() {
          app.setLoading(false);
          callback.apply(null, arguments);
        })
      );
    };
  }

  let app = {
    login: function() {
      var credentials = {
        username: fastn.Model.get(state, "username"),
        password: fastn.Model.get(state, "password")
      };
      loading(api.login)(credentials, function(error, token) {
        if (error) {
          return app.setError(error);
        }
        app.setToken(token);
      });
    },
    coffeeTime: function() {
      var token = fastn.Model.get(state, "token");
      var name = fastn.Model.get(state, "name");
      loading(api.ask)(token, name, function(error, token) {
        if (error) {
          return app.setError(error);
        }
        console.log("Success! (REPLACE ME)");
      });
    },
    setToken: function(token) {
      var parsed = JSON.parse(token);
      fastn.Model.set(state, "token", parsed.token);
    },
    setLoading: function(loading) {
      fastn.Model.set(state, "loading", loading);
    },
    storeName: function() {
      localStorage.setItem("coffee-bot-name", fastn.Model.get(state, "name"));
    },
    getName: function() {
      var name = localStorage.getItem("coffee-bot-name");
      fastn.Model.set(state, "name", name);
    }
  };

  return app;
};
