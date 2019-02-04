module.exports = function createLoginButton(fastn, app) {
  return fastn("button", { class: "login" }, "Login").on("click", event => {
    event.preventDefault();
    app.login();
  });
};
