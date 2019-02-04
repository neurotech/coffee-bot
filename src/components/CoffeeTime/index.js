const NameInput = require("./NameInput");
const CoffeeButton = require("./CoffeeButton");

module.exports = function combineComponents(fastn, app) {
  return fastn(
    "form",
    {
      class: "coffee-time",
      hidden: fastn.binding("token", token => {
        return !token;
      })
    },
    NameInput(fastn, app),
    CoffeeButton(fastn, app)
  );
};
