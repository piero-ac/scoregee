import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoose = require('mongoose');

//function imports
import { config } from './football-api/config.js';
import { Standing } from './models/standing.js';
import { Fixture } from './models/fixture.js';
const axios = require("axios");

const leagueIDs = {
    'epl' : 'Premier League',
    'seriea' : 'Seria A',
    'ligue1' : 'Ligue 1',
    'bundesliga' : 'Bundesliga',
    'laliga' : 'La Liga'
}

const ids = {
    'epl' : '39',
    'seriea' : '135',
    'ligue1' : '61',
    'bundesliga' : '78',
    'laliga' : '140'

}

main()
.then(() => {
    console.log("MONGO CONNECTION OPENED");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/scoregee');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
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
app.get('/football/:league', async (req, res) => {
    const { league } = req.params;
    const id = ids[league];
    const standings = await Standing.findOne({leagueID: `${id}`});
    res.render('football/league', { standings, league });
})

// Displays upcoming league matches until the end of the season
app.get('/football/:league/fixtures', async (req, res) => {
    const { league } = req.params;
    const id = ids[league];
    
    // Query fixture information for specified league and season (to be implemented)
    const fixtures = await Fixture.find({'league.id' : id, 'league.season' : 2022});

    // Get dates from fixtures
    let fixtureDates = new Set();
    for(let i = 0; i < fixtures.length; i++){
        let { fixture: { date } } = fixtures[i];
        date = date.substring(0, date.indexOf('T'));
        fixtureDates.add(date);
    }

    // Sort the dates
    fixtureDates = Array.from(fixtureDates);
    fixtureDates.sort((a, b) => a.localeCompare(b));

    // Send dates to football/fixtures
    res.render('football/fixtures', { leagueName : leagueIDs[league], fixtureDates, league })
})

app.get('/football/:league/fixtures/:date', async (req, res) => {
    const { league, date } = req.params;
    const id = ids[league];

    // Query fixture information based on leauge, season (to be added), and date
    const fixtures = await Fixture.find({'league.id' : id, 'league.season' : 2022, 'fixture.date': { '$regex': `.*${date}.*`}});

    // Send fixtures to football/matches
    res.render('football/matches', { fixtures, league, date })
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})