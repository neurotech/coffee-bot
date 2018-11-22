module.exports = function getQuestion(userName) {
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
  return `*${userName}* asks: ${
    questions[Math.floor(Math.random() * questions.length)]
  }`;
};
