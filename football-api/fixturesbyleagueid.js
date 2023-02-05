import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");
import { config } from "./config.js";

const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    params: {league: '39', season: '2022'},
    headers: {
      'X-RapidAPI-Key': config.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  
  axios.request(options)
    .then(function (response) {
        displayLeagueFixtures(response.data);
    }).catch(function (error) {
        console.error(error);
    });

function displayLeagueFixtures(res){
    const data = res.response;
    for(let i = 0; i < 5; i++){
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
        
        console.log(`Matchday: ${round}`)
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

/**
{
  fixture: {
    id: 867946,
    referee: 'Anthony Taylor, England',
    timezone: 'UTC',
    date: '2022-08-05T19:00:00+00:00',
    timestamp: 1659726000,
    periods: { first: 1659726000, second: 1659729600 },
    venue: { id: 525, name: 'Selhurst Park', city: 'London' },
    status: { long: 'Match Finished', short: 'FT', elapsed: 90 }
  },
  league: {
    id: 39,
    name: 'Premier League',
    country: 'England',
    logo: 'https://media-3.api-sports.io/football/leagues/39.png',
    flag: 'https://media-3.api-sports.io/flags/gb.svg',
    season: 2022,
    round: 'Regular Season - 1'
  },
  teams: {
    home: {
      id: 52,
      name: 'Crystal Palace',
      logo: 'https://media.api-sports.io/football/teams/52.png',
      winner: false
    },
    away: {
      id: 42,
      name: 'Arsenal',
      logo: 'https://media-3.api-sports.io/football/teams/42.png'c,
      winner: true
    }
  },
  goals: { home: 0, away: 2 },
  score: {
    halftime: { home: 0, away: 1 },
    fulltime: { home: 0, away: 2 },
    extratime: { home: null, away: null },
    penalty: { home: null, away: null }
  }
}
 */