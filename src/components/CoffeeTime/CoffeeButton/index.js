module.exports = function createCoffeeButton(fastn, app) {
  return fastn("button", "Coffee Time").on("click", event => {
    event.preventDefault();
    app.coffeeTime();
  });
};
