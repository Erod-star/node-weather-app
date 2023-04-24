const fs = require("fs");

const axios = require("axios");

class Searchs {
  constructor() {
    this.history = [];
    this.dbPath = "database/database.json";
    this.readDB();
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lon: "",
      lat: "",
    };
  }

  get capitalizeHistory() {
    return this.history.map((place) => {
      let words = place.split(" ");
      words = words.map((word) => word[0].toUpperCase() + word.substring(1));

      return words.join(" ");
    });
  }

  async getPlaces(place) {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapBox,
      });

      const { data } = await instance.get();
      return data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async placeWeather(lat, lng) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather?",
        params: {
          ...this.paramsOpenWeather,
          lon: lng,
          lat,
        },
      });
      const { data } = await instance.get();
      const { weather, main } = data;
      // console.log("::data", data);
      return {
        desc: weather[0].description || "No description provided",
        temp: main.temp,
        max: main.temp_max,
        min: main.temp_min,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addToHistory(place = "") {
    if (this.history.includes(place.toLowerCase())) return;
    this.history = this.history.splice(0, 5);

    this.history.unshift(place.toLowerCase());
    this.storeInDB();
  }

  storeInDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.history = data.history;
  }
}

module.exports = Searchs;
