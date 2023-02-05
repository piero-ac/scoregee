import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");
import { config } from "./config.js";

const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    params: {season: '2022', team: '33'},
    headers: {
      'X-RapidAPI-Key': config.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
      displayTeamFixtures(response.data);
  }).catch(function (error) {
      console.error(error);
  });


function displayTeamFixtures(res){
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

        console.log(`Competition: ${leagueName} - Round: ${round}`); // check if all the matches are for EPL. 
        /**
         Competition: Premier League - Round: Regular Season - 1
Competition: Premier League - Round: Regular Season - 2
Competition: Premier League - Round: Regular Season - 3
Competition: Premier League - Round: Regular Season - 4
Competition: Premier League - Round: Regular Season - 5
Competition: Premier League - Round: Regular Season - 6
Competition: Premier League - Round: Regular Season - 7
Competition: Premier League - Round: Regular Season - 8
Competition: Premier League - Round: Regular Season - 9
Competition: Premier League - Round: Regular Season - 10
Competition: Premier League - Round: Regular Season - 11
Competition: Premier League - Round: Regular Season - 12
Competition: Premier League - Round: Regular Season - 13
Competition: Premier League - Round: Regular Season - 14
Competition: Premier League - Round: Regular Season - 15
Competition: Premier League - Round: Regular Season - 16
Competition: Premier League - Round: Regular Season - 17
Competition: Premier League - Round: Regular Season - 18
Competition: Premier League - Round: Regular Season - 19
Competition: Premier League - Round: Regular Season - 20
Competition: Premier League - Round: Regular Season - 21
Competition: Premier League - Round: Regular Season - 22
Competition: Premier League - Round: Regular Season - 23
Competition: Premier League - Round: Regular Season - 24
Competition: Premier League - Round: Regular Season - 25
Competition: Premier League - Round: Regular Season - 26
Competition: Premier League - Round: Regular Season - 27
Competition: Premier League - Round: Regular Season - 28
Competition: Premier League - Round: Regular Season - 29
Competition: Premier League - Round: Regular Season - 30
Competition: Premier League - Round: Regular Season - 31
Competition: Premier League - Round: Regular Season - 32
Competition: Premier League - Round: Regular Season - 33
Competition: Premier League - Round: Regular Season - 34
Competition: Premier League - Round: Regular Season - 35
Competition: Premier League - Round: Regular Season - 36
Competition: Premier League - Round: Regular Season - 37
Competition: Premier League - Round: Regular Season - 38
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 5
Competition: League Cup - Round: 3rd Round
Competition: UEFA Europa League - Round: Group Stage - 1
Competition: UEFA Europa League - Round: Group Stage - 2
Competition: UEFA Europa League - Round: Group Stage - 3
Competition: UEFA Europa League - Round: Group Stage - 4
Competition: UEFA Europa League - Round: Group Stage - 5
Competition: UEFA Europa League - Round: Group Stage - 6
Competition: UEFA Europa League - Round: Knockout Round Play-offs
Competition: UEFA Europa League - Round: Knockout Round Play-offs
Competition: League Cup - Round: Round of 16
Competition: FA Cup - Round: 3rd Round
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: Friendlies Clubs - Round: Club Friendlies 1
Competition: League Cup - Round: Quarter-finals
Competition: FA Cup - Round: 4th Round
Competition: League Cup - Round: Semi-finals
Competition: League Cup - Round: Semi-finals
Competition: FA Cup - Round: 5th Round
Competition: League Cup - Round: Final
         */
    }

    
    // console.log(data.length);
}
