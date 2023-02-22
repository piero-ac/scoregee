import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const eplData = require('./match-data/en1.json');
// const laligaData = require('./match-data/es1.json');
// const ligue1Data = require('./match-data/fr1.json');
// const bundesligaData = require('./match-data/de1.json');
// const serieaData = require('./match-data/it1.json');
import { findDates, findMatches } from './leagueFunctions.js';

//function imports
import { config } from './football-api/config.js';
const axios = require("axios");

const leagueIDs = {
    'epl' : 'Premier League',
    'seriea' : 'Seria A',
    'ligue1' : 'Ligue 1',
    'bundesliga' : 'Bundesliga',
    'laliga' : 'La Liga'
}


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.send("Hello World");
})

// Football Homepage
app.get('/football', (req, res) => {
    res.render('football/index');
})

// Displays table of team standings in the specified league
app.get('/football/:league', (req, res) => {
    const { league } = req.params;
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
        params: {league: '', season: '2022'},
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': "3929d7ffd1mshebbaec9f369e0efp1f8b5bjsn5b5ffa6ed367"
        }   
    }
    if(league === 'epl'){
        options.params.league = '39';
    } else if (league === 'ligue1'){
        options.params.league = '61';
    }else if (league === 'laliga'){
        options.params.league = '140';
    } else if (league === 'bundesliga'){
        options.params.league = '78';
    } else if (league === 'seriea'){
        options.params.league = '135';
    }

    axios.request(options)
    .then((res) => {
        const league = res.data.response[0].league;
        const { id: leagueID, name: leagueName, country : leagueCountry, standings} = league;
        return standings[0];
    })
    .then((leagueStandings) => {
        res.render('football/league', { leagueName : leagueIDs[league], leagueStandings, league })
    })
    .catch((e) => {
        console.error(e);
    })
})

// Displays upcoming league matches until the end of the season
app.get('/football/:league/fixtures', (req, res) => {
    const { league } = req.params;
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {league: '', season: '2022'},
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': "3929d7ffd1mshebbaec9f369e0efp1f8b5bjsn5b5ffa6ed367"
        }   
    }
    if(league === 'epl'){
        options.params.league = '39';
    } else if (league === 'ligue1'){
        options.params.league = '61';
    }else if (league === 'laliga'){
        options.params.league = '140';
    } else if (league === 'bundesliga'){
        options.params.league = '78';
    } else if (league === 'seriea'){
        options.params.league = '135';
    }

    axios.request(options)
    .then((res) => {
        const leagueFixtures = res.data.response;
        return leagueFixtures;
    })
    .then((leagueFixtures) => {
        const dates = [];
        for(let i = 0; i < leagueFixtures.length; i++) { 
            const { fixture } = leagueFixtures[i]; 
            const { date } = fixture;
            
            const dateShortened = date.substring(0, date.indexOf('T'));
            if(!dates.includes(dateShortened)){
                dates.push(dateShortened);
            }
        }
        return dates;
    }).then((dates) => {
        res.render('football/fixtures', { leagueName : leagueIDs[league], dates, league })
    })
    .catch((e) => {
        console.error(e);
    })
})

app.get('/football/:league/fixtures/:date', (req, res) => {
    const { league, date } = req.params;
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {league: '', season: '2022', from: date, to: date},
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': "3929d7ffd1mshebbaec9f369e0efp1f8b5bjsn5b5ffa6ed367"
        }   
    }
    if(league === 'epl'){
        options.params.league = '39';
    } else if (league === 'ligue1'){
        options.params.league = '61';
    }else if (league === 'laliga'){
        options.params.league = '140';
    } else if (league === 'bundesliga'){
        options.params.league = '78';
    } else if (league === 'seriea'){
        options.params.league = '135';
    }

    axios.request(options)
    .then((res) => {
        const leagueFixturesByDate = res.data.response;
        return leagueFixturesByDate;
    })
    .then((leagueFixturesByDate) => {
        res.render('football/matches', { leagueName : leagueIDs[league], leagueFixturesByDate, league, date })
    })
    .catch((e) => {
        console.error(e);
    })
})

app.get('/football/:league/fixture-linenup/:fixtureid', (req, res) => {
    const { league, fixtureid } = req.params;
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups',
        params: {fixture: fixtureid},
  headers: {
    'X-RapidAPI-Key': '3929d7ffd1mshebbaec9f369e0efp1f8b5bjsn5b5ffa6ed367',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};
axios.request(options)
.then(function (response) {
    //console.log(response.data.response);
    const fixturelineup=response.data.response;
    res.render('football/Lineup', {
fixturelineup
    })
//     for (let team of response.data.response)
//     {
//         const { startXI } = team;  
//       //  console.log(startXI);
//     for (let player of startXI) {
//         const name = player.player.name;
//         const number = player.player.number;
// console.log(name, number);
//     }

//     }

}).catch(function (error) {
    console.error(error);
});
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})

