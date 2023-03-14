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
    //   console.log(fixturesData[0]);
      const fixtures = [];

      // Get all the fixtures for the league and save to array
      for(let i = 0; i < fixturesData.length; i++){
        let { fixture, league, teams, goals, score } = fixturesData[i];
        const date = fixture.date;
        const time = date.substring(date.indexOf('T')+1, date.indexOf('T')+6); // extract time
        fixture.time = time;

        // Replace null values with N/A
        fixture = replaceNull(fixture, 'N/A');
        league = replaceNull(league, 'N/A');
        teams = replaceNull(teams, 'N/A');
        goals = replaceNull(goals, 'N/A');
        score = replaceNull(score, 'N/A');

        fixtures.push({ fixture, league, teams, goals, score });
      }
      return fixtures;
}

function replaceNull(obj, replacement){
    for (let prop in obj) {
        if (obj[prop] === null) {
          obj[prop] = replacement;
        } else if (typeof obj[prop] === 'object') {
          replaceNull(obj[prop], replacement);
        }
      }
      return obj;
}

// const eplFixtures = await getLeagueFixtures('39', '2022');

// Fixture.insertMany(eplFixtures)
// .then((data) => {
//     console.log("IT WORKED");
// })
// .catch((err) => {
//     console.log(err);
// })

// const seriaAFixtures = await getLeagueFixtures('135', '2022');
// Fixture.insertMany(seriaAFixtures)
// .then((data) => {
//     console.log("IT WORKED- Seria A");
// })
// .catch((err) => {
//     console.log(err);
// })

// const ligue1Fixtures = await getLeagueFixtures('61', '2022');
// Fixture.insertMany(ligue1Fixtures)
// .then((data) => {
//     console.log("IT WORKED - ligue1");
// })
// .catch((err) => {
//     console.log(err);
// })

// const bundesligaFixtures = await getLeagueFixtures('78', '2022');
// Fixture.insertMany(bundesligaFixtures)
// .then((data) => {
//     console.log("IT WORKED  - bundesliga");
// })
// .catch((err) => {
//     console.log(err);
// })

// const laligaFixtures = await getLeagueFixtures('140', '2022');
// Fixture.insertMany(laligaFixtures)
// .then((data) => {
//     console.log("IT WORKED - laliga");
// })
// .catch((err) => {
//     console.log(err);
// })