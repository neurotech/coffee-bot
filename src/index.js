const fastn = require("fastn")(require("fastn/domComponents")());
const components = require("./components");

import "normalize.css";

window.addEventListener("load", function() {
  let App = require("./app");
  let state = {};

  const view = components(fastn, App(fastn, state));
  view.attach(state);
  view.render();

  const mount = document.getElementById("app");
  mount.appendChild(view.element);
});
