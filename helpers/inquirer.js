const inquirer = require("inquirer");
require("colors");

const inquirerMenu = async () => {
  const questions = [
    {
      type: "list",
      name: "option",
      message: "What do you wanna do?",
      choices: [
        { value: 1, name: `${"1.".green} Search a city` },
        { value: 2, name: `${"2.".green} History` },
        { value: 0, name: `${"0.".green} Exit` },
      ],
    },
  ];

  console.clear();
  console.log("=======================".green);
  console.log("   Select an option    ".green);
  console.log("=======================\n".green);

  const { option } = await inquirer.prompt(questions);

  return option;
};

const menuStop = async () => {
  const resolver = [
    {
      type: "input",
      name: "input",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(resolver);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "input",
      message,
      validate(value) {
        if (value.length == 0) {
          return "Please submit a value";
        }
        return true;
      },
    },
  ];
  const { input } = await inquirer.prompt(question);
  return input;
};

const listPlaces = async (places) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: `${"0.".green} Cancel`,
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select a place",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);

  return id;
};

const confirmPrompt = async () => {
  const question = [
    {
      type: "confirm",
      name: "confirmation",
      message: "Are you sure that you want to delete this task?",
    },
  ];

  const { confirmation } = await inquirer.prompt(question);
  return confirmation;
};

const beforeCompleteTaskPrompt = async (tasks) => {
  const choices = tasks.map((task, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: task.id,
      name: `${idx} ${task.desc}`,
      checked: task.completedAt ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Select a task to complete",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(question);

  return ids;
};

module.exports = {
  inquirerMenu,
  menuStop,
  readInput,
  listPlaces,
  confirmPrompt,
  beforeCompleteTaskPrompt,
};
