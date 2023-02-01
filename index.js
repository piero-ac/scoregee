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
app.get('/football/:country/:league', (req, res) => {
    const { country, league } = req.params;
    res.send(`Client wants to see the table for ${country}'s ${league}`);
})

// Displays upcoming league matches until the end of the season
app.get('/football/:country/:league/fixtures', (req, res) => {
    const { country, league } = req.params;
    let matchDates; 
    if(country === 'england' && league === 'epl'){
        matchDates = findDates(eplData);
    } else if (country === 'france' && league === 'ligue1'){
        matchDates = findDates(ligue1Data);
    }else if (country === 'spain' && league === 'laliga'){
        matchDates = findDates(laligaData);
    } else if (country === 'germany' && league === 'bundesliga'){
        matchDates = findDates(bundesligaData);
    } else if (country === 'italy' && league === 'seriea'){
        matchDates = findDates(serieaData);
    }
    res.send(`Displaying fixtures for the ${league} league`);
})

app.get('/football/:country/:league/fixtures/:date', (req, res) => {
    const { country, league, date } = req.params;
    res.send(`Displaying fixtures for the ${league} league for ${date}`);
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})