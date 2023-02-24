// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mongoose from 'mongoose';
import { FixtureLineup } from '../models/lineup.js';
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


// Insert Fixture Lineup information
async function getFixtureLineup(id){
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups',
        params: {fixture: id},
        headers: {
          'X-RapidAPI-Key': config.RAPID_API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const data = response.data.response;
    const { team: homeTeam, coach: homeCoach, formation: homeFormation, startXI: homeStartXI, substitutes: homeSubstitutes } = data[0];
    const { team: awayTeam, coach: awayCoach, formation: awayFormation, startXI: awayStartXI, substitutes: awaySubstitutes } = data[1];

    const fixtureid = id;
    const teams = { homeTeam, awayTeam };
    const coaches = { homeCoach, awayCoach };
    const formations = { homeFormation, awayFormation };
    const homeLineup = { homeStartXI, homeSubstitutes };
    const awayLineup = { awayStartXI, awaySubstitutes };
    const lineups = { homeLineup, awayLineup };


    return { fixtureid, teams, coaches, formations, lineups };  
}

const fixtureLineup = await getFixtureLineup(867946);
console.log(fixtureLineup);