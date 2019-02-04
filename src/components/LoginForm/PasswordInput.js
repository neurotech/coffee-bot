module.exports = function createPasswordInput(fastn, app) {
  return fastn("input", {
    class: "password",
    required: true,
    type: "password",
    placeholder: "Password",
    value: fastn.binding("password"),
    oninput: "value:value"
  });
};
