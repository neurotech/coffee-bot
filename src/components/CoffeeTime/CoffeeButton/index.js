module.exports = function createCoffeeButton(fastn, app) {
  return fastn(
    "button",
    {
      disabled: fastn.binding("loading", loading => {
        return loading;
      })
    },
    "Coffee Time"
  ).on("click", event => {
    event.preventDefault();
    app.storeName();
    app.coffeeTime();
  });
};
