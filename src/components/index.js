const LoginForm = require("./LoginForm");
const CoffeeTime = require("./CoffeeTime");

module.exports = function combineComponents(fastn, app) {
  app.getName();

  return fastn(
    "div",
    { class: "container" },
    LoginForm(fastn, app),
    CoffeeTime(fastn, app)
  );
};
