require("dotenv").config();

const { readInput, listPlaces } = require("./helpers/inquirer");
const { inquirerMenu, menuStop } = require("./helpers/inquirer");
const Searchs = require("./models/searchs");

const main = async () => {
  const searchs = new Searchs();
  let opt = null;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        const searchTerm = await readInput("Place:");
        const places = await searchs.getPlaces(searchTerm);

        const id = await listPlaces(places);
        if (id === "0") continue;

        const { name, lat, lng } = places.find((p) => p.id === id);
        searchs.addToHistory(name);
        const { desc, temp, max, min } = await searchs.placeWeather(lat, lng);

        // ? Show results
        console.log("\nInfo of the city\n".green);
        console.log("City:", name);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("Temperature:", temp);
        console.log("Min temperature:", max);
        console.log("Max temperature:", min);
        console.log("How's the weather:", desc);
        break;

      case 2:
        searchs.capitalizeHistory.forEach((place, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    if (opt !== 0) await menuStop();
  } while (opt !== 0);
};

main();
