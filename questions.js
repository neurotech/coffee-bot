module.exports = function getQuestion(name) {
  let names = [
    "Someone",
    "An anonymous coffee fan",
    "A tired person",
    "Someone who needs coffee"
  ];
  let verbs = ["asks", "asked", "wonders", "would like to know", "inquires"];
  let questions = [
    "Anyone for coffee?",
    "Anyone for ｃｏｆｆｅｅ?",
    "Coffee anyone?",
    "ｃｏｆｆｅｅ anyone?",
    "Coffee time, anyone interested?",
    "COFFEE who's interested?",
    ":coffee: anyone?",
    ":coffee:?",
    ":coffee: :coffee: :coffee:?",
    "Would anyone like a coffee?",
    "Coffee time. Who's joining me?",
    "Any takers?"
  ];

  if (!name) {
    name = names[Math.floor(Math.random() * names.length)];
  }

  var verb = verbs[Math.floor(Math.random() * verbs.length)];
  var question = questions[Math.floor(Math.random() * questions.length)];

  return `*${name}* ${verb}:\n> _${question}_`;
};
