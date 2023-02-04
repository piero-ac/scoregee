import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
    params: {season: '2022', league: '39'},
    headers: {
      'X-RapidAPI-Key': '9c4deaf318msh0c5222871352babp16fb89jsnfe2c2ef108cc',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

axios.request(options)
    .then(function (response) {
        displayTeamIDs(response.data);
    }).catch(function (error) {
        console.error(error);
    });


function displayTeamIDs(res) {
    const data = res.response;
    for(let i = 0; i < data.length; i++){
        const { team: { id: teamID, name: teamName, code: teamCode, country, founded, national, logo},
                venue: { id: venueID, name: venueName, address, city, capacity, surface, image}} = data[i];
        console.log(`Team: ${teamName} - ID: ${teamID}`);
    }
}
/**
 * Data for one team
  team: {
    id: 33,
    name: 'Manchester United',
    code: 'MUN',
    country: 'England',
    founded: 1878,
    national: false,
    logo: 'https://media-3.api-sports.io/football/teams/33.png'
  },
  venue: {
    id: 556,
    name: 'Old Trafford',
    address: 'Sir Matt Busby Way',
    city: 'Manchester',
    capacity: 76212,
    surface: 'grass',
    image: 'https://media-3.api-sports.io/football/venues/556.png'
  }
 */

/**
 * EPL TeamIDs
Team: Manchester United - ID: 33
Team: Newcastle - ID: 34
Team: Bournemouth - ID: 35
Team: Fulham - ID: 36
Team: Wolves - ID: 39
Team: Liverpool - ID: 40
Team: Southampton - ID: 41
Team: Arsenal - ID: 42
Team: Everton - ID: 45
Team: Leicester - ID: 46
Team: Tottenham - ID: 47
Team: West Ham - ID: 48
Team: Chelsea - ID: 49
Team: Manchester City - ID: 50
Team: Brighton - ID: 51
Team: Crystal Palace - ID: 52
Team: Brentford - ID: 55
Team: Leeds - ID: 63
Team: Nottingham Forest - ID: 65
Team: Aston Villa - ID: 66
 */