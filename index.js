require("dotenv").config();
const SunCalc = require("suncalc");

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


app.command("/slbot-moon", async ({ command, respond }) => {
  const times = SunCalc.getMoonIllumination(new Date());

  const phase = times.phase;

  let moonStage;

  if (phase < 0.0625 || phase >= 0.9375) {
    moonStage = "New Moon 🌑";
  } else if (phase < 0.1875) {
    moonStage = "Waxing Crescent 🌒";
  } else if (phase < 0.3125) {
    moonStage = "First Quarter 🌓";
  } else if (phase < 0.4375) {
    moonStage = "Waxing Gibbous 🌔";
  } else if (phase < 0.5625) {
    moonStage = "Full Moon 🌕";
  } else if (phase < 0.6875) {
    moonStage = "Waning Gibbous 🌖";
  } else if (phase < 0.8125) {
    moonStage = "Last Quarter 🌗";
  } else {
    moonStage = "Waning Crescent 🌘";
  }

  await respond({
    text: `Moon Phase: ${moonStage}`
  });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();