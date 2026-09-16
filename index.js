require("dotenv").config();

async function geocoding(city) {
  const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.toLowerCase())}&count=1`);

  const location = await geo.json();

  return location.results[0];
  // latitude, longitude, name
}

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/slbot-temperature", async ({ command, respond }) => {

  const city = await geocoding(command.text.trim());

  const response = await fetch(
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + city.latitude  +
      "&longitude=" + city.longitude +
      "&current=temperature_2m" +
      "&timezone=Asia%2FKarachi"
  );

  const data = await response.json();

  await respond({ text: `City: ${city.name}\nCurrent Temperature: ${data.current.temperature_2m}` });
});

app.command("/slbot-humidity", async ({ command, respond }) => {

  const city = await geocoding(command.text.trim());

  const response = await fetch(
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + city.latitude  +
      "&longitude=" + city.longitude +
      "&current=relative_humidity_2m" +
      "&timezone=Asia%2FKarachi"
  );

  const data = await response.json();

  await respond({ text: `City: ${city.name}\nRelative Humidity: ${data.current.relative_humidity_2m}%` });
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();