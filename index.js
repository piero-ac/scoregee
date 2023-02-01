import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eplData = require('./match-data/en1.json');
const laligaData = require('./match-data/es1.json');
const ligue1Data = require('./match-data/fr1.json');
const bundesligaData = require('./match-data/de1.json');
const serieaData = require('./match-data/it1.json');
import { findDates } from './leagueFunctions.js';

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
    console.log(eplData.rounds[0].matches[0]);
})

// Football Homepage
app.get('/football', (req, res) => {
    res.render('football/index');
})

// Displays table of team standings in the specified league
app.get('/football/:league', (req, res) => {
    const { league } = req.params;
    res.render('football/leauge', { leagueInfo: {
        leagueName : leagueIDs[league]}
     });
    // res.send(`League: ${league}`);
})

// Displays upcoming league matches until the end of the season
app.get('/football/:league/fixtures', (req, res) => {
    const { league } = req.params;
    let matchDates;
    if(league === 'epl'){
        matchDates = findDates(eplData);
    } else if (league === 'ligue1'){
        matchDates = findDates(ligue1Data);
    }else if (league === 'laliga'){
        matchDates = findDates(laligaData);
    } else if (league === 'bundesliga'){
        matchDates = findDates(bundesligaData);
    } else if (league === 'seriea'){
        matchDates = findDates(serieaData);
    }
    res.send(`Displaying fixtures for the ${league} league`);
})

app.get('/football/:league/fixtures/:date', (req, res) => {
    const { league, date } = req.params;
    res.send(`Displaying fixtures for the ${league} league for ${date}`);
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})