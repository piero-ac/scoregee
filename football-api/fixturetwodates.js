import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");
import { config } from "./config.js";

const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  params: {league: '39', season: '2022', from: '2023-01-01', to: '2023-01-05'},
  headers: {
    'X-RapidAPI-Key': config.RAPID_API_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

axios.request(options)
    .then(function (response) {
        console.log(response.data);
        displayLeagueFixturesBetweenTwoDates(response.data);
    }).catch(function (error) {
        console.error(error);
    });

function displayLeagueFixturesBetweenTwoDates(res){
    const data = res.response;
    for(let i = 0; i < data.length; i++){
        const { fixture, league, teams, goals, score } = data[i];
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
        
        console.log(`Matchday: ${round} - Date: ${date.substring(0, date.indexOf('T'))}`);
        console.log(`Home: ${homeName} vs. Away: ${awayName}`);
        console.log(`Halftime Score: ${homeGoalsHT} - ${awayGoalsHT}`);
        console.log(`Fulltime Score: ${homeGoalsFT} - ${awayGoalsFT}`);
        if(homeGoals === awayGoals){
            console.log('DRAW');
        } else {
            console.log(`Winner: ${(homeIsWinner) ? homeName : awayName}`);
        }
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
    }
}