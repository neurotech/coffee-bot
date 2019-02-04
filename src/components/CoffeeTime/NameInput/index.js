module.exports = function createNameInput(fastn, app) {
  return fastn("input", {
    class: "name",
    autofocus: true,
    placeholder: "Your name (optional)",
    value: fastn.binding("name"),
    oninput: "value:value"
  });
};
