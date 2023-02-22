// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mongoose from 'mongoose';
import { Fixture } from '../models/fixture.js';
const axios = require("axios");
import { config } from "./config.js";

main()
.then(() => {
    console.log("MONGO CONNECTION OPENED");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/scoregee');
}


// Insert Fixtures Information
async function getLeagueFixtures(id, season){
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {league: id, season: season},
        headers: {
          'X-RapidAPI-Key': config.RAPID_API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      const fixturesData = response.data.response;
      for(let i = 0; i < fixturesData; i++){
        const { fixture, league, teams, goals, score } = fixturesData[i];
        const { id: fixtureID, referee, timezone, date, timestamp, 
                periods: { first: firstPeriod, second: secondPeriod }, 
                venue : { id: venueID, name: venueName, city: venueCity}, 
                status: { long: statusLong, short: statusShort, elapsed}} = fixture;
        const { id: leagueID, name: leagueName, country, logo, flag, season, round } = league;
        const { home : { id: homeID, name: homeName, logo: homeLogo, winner: homeIsWinner}, 
                away: { id: awayID, name: awayName, logo: awayLogo, winner: awayIsWinner} } = teams;
        const { home: homeGoals, away: awayGoals} = goals;
        const { halftime: { home: homeGoalsHT, away: awayGoalsHT },
                fulltime: { home: homeGoalsFT, away: awayGoalsFT },
                extratime: { home: homeGoalsET, away: awayGoalsET },
                penalty: { home: homeGoalsPT, away: awayGoalsPT } } = score;

        const time = date.substring(date.indexOf('T')+1, date.indexOf('T')+6); // extract time

      }
      
}