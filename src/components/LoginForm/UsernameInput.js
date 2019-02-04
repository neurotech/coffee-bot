module.exports = function createUsernameInput(fastn, app) {
  return fastn("input", {
    class: "username",
    autofocus: true,
    required: true,
    placeholder: "Username",
    value: fastn.binding("username"),
    oninput: "value:value"
  });
};
