const UsernameInput = require("./UsernameInput");
const PasswordInput = require("./PasswordInput");
const LoginButton = require("./LoginButton");

module.exports = function createLoginForm(fastn, app) {
  return fastn(
    "form",
    {
      class: fastn.binding("loading", loading => {
        return ["login-form", loading && "loading"];
      }),
      hidden: fastn.binding("token", token => {
        return token && token.length > 1;
      })
    },
    UsernameInput(fastn, app),
    PasswordInput(fastn, app),
    LoginButton(fastn, app)
  );
};
