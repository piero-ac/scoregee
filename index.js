import express from 'express';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoose = require('mongoose');

import { Standing } from './models/standing.js';
import { Fixture } from './models/fixture.js';
const cors = require('cors');

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

app.use(express.static('public'));
app.use(cors());

// Sends the ScoreGee - Football Homepage
app.get('/football', (req, res) => {
    res.sendFile(__dirname + "/public/soccer.html");
})

// Sends the html file for displaying league rankings
app.get('/football/:league', (req, res) => {
    res.sendFile(__dirname + "/public/league.html")
})

// Sends the json object with the rankings after league.html loads
app.get('/football/:league/standings', async (req, res) => {
    const { league } = req.params;
    const id = ids[league];
    const standings = await Standing.findOne({leagueID: `${id}`});
    res.json(standings);
})

// Sends the html file for displaying the dates for fixtures
app.get('/football/:league/fixtures', async (req, res) => {
    res.sendFile(__dirname + "/public/fixtures.html")
})

// Sends the json object with the fixtures after league.html loads
app.get('/football/:league/fixtures-data', async (req, res) => {
    const { league } = req.params;
    const id = ids[league];
    // Query fixture information for specified league and season (to be implemented)
    const fixtures = await Fixture.find({'league.id' : id, 'league.season' : 2022});
    res.json({ league, leagueName : leagueIDs[league], fixtures});
})

// Sends the html file for displaying the matches for the specified date
app.get('/football/:league/fixtures/:date', async (req, res) => {
    res.sendFile(__dirname + "/public/matches.html");
})

// Sends the json object with the matches for the specified date after league.html loads
app.get('/football/:league/fixtures/:date/data', async (req, res) => {
    const { league, date } = req.params;
    const id = ids[league];

    // Query fixture information based on leauge, season (to be added), and date
    const fixtures = await Fixture.find({'league.id' : id, 'league.season' : 2022, 'fixture.date': { '$regex': `.*${date}.*`}});
    res.json({ fixtures, league, date });
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})