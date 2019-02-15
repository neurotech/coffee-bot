module.exports = function getQuestion(userName) {
  let verbs = ["asks", "asked", "would like to know", "inquires"];
  let questions = [
    "Anyone for coffee?",
    "Anyone for ｃｏｆｆｅｅ?",
    "Coffee anyone?",
    "ｃｏｆｆｅｅ anyone?",
    "Coffee time, anyone interested?",
    "COFFEE who's interested?",
    ":coffee: anyone?",
    ":coffee:?",
    ":coffee: :coffee: :coffee:?"
  ];

  var verb = verbs[Math.floor(Math.random() * verbs.length)];
  var question = questions[Math.floor(Math.random() * questions.length)];

  return `*${userName}* ${verb}:\n> ${question}`;
};
