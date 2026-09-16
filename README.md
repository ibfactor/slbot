<h1 align="center">SLBot</h1>
<p>A Slack bot made in NodeJS which returns weather and moon information.</p>
<p>A ready to use version can be accessed on the HackClub Slack.</p>

### Features/Commands
- `/slbot-temperature [city name]`  Shows the current temperature of a city
- `/slbot-humidity [city name]`     Shows the humidity of a city
- `/slbot-moon`                     Shows the current moon phase
### Self-Hosting:
Clone the repository
```
git clone https://github.com/ibfactor/slbot.git && cd slbot
```
Setup the .env file
```
touch .env
```
and then declare the two environment variables (in the .env).
These can be obtained after you create a Slack app
```
SLACK_APP_TOKEN=xapp-...
SLACK_BOT_TOKEN=xoxb-...
```
Then install the required NPM packages and run the bot server.
```
npm install && node index.js
```
### External Dependencies:
Relies on the "open-meteo" public API for both geocoding and weather information (temperature/humidity)
The `suncalc` module is used to calculate the current moon stage
