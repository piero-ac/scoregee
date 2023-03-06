// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mongoose from 'mongoose';
import { Standing } from '../models/standing.js';
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

// Insert Standings Information
async function getLeagueStandings(id, season){
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
        params: {league: id, season: season},
        headers: {
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
          'x-rapidapi-key': config.RAPID_API_KEY
        }
    };
    const response = await axios.request(options);
    const league = response.data.response[0].league;
    const { id: leagueID, name: leagueName, season: leagueSeason, standings} = league;
    const leagueStandings = [];

    for(let t of standings[0]){
        const { rank: teamRanking, team: teamInfo, points: teamPoints } = t;
        const { id: teamID, name: teamName } = teamInfo;
        leagueStandings.push( { teamID, teamName, teamPoints, teamRanking });
    }

    return { leagueName, leagueID, leagueSeason, leagueStandings }
}

// Get the Standings for the premier league - DONE
// const eplStandings = await getLeagueStandings('39', '2022');
// const premierLeagueStandings = new Standing(eplStandings);
// premierLeagueStandings.save()
// .then((data) => {
//     console.log("IT WORKED");
//     console.log(data);
// })
// .catch((err) => {
//     console.log("OH NO ERROR");
//     console.log(err);
// })

// League Name: Serie A - ID: 135 - DONE
// const itDiv1Standings = await getLeagueStandings('135', '2022');
// const serieAStandings = new Standing(itDiv1Standings);
// serieAStandings.save()
// .then((data) => {
//     console.log("IT WORKED");
//     console.log(data);
// })
// .catch((err) => {
//     console.log("OH NO ERROR");
//     console.log(err);
// })

// League Name: Ligue 1 - ID: 61 - DONE
// const frDiv1Standings = await getLeagueStandings('61', '2022');
// const ligue1Standings = new Standing(frDiv1Standings);
// ligue1Standings.save()
// .then((data) => {
//     console.log("IT WORKED");
//     console.log(data);
// })
// .catch((err) => {
//     console.log("OH NO ERROR");
//     console.log(err);
// })

// League Name: Bundesliga - ID: 78 - DONE
// const geDiv1Standings = await getLeagueStandings('78', '2022');
// const bundesligaStandings = new Standing(geDiv1Standings);
// bundesligaStandings.save()
// .then((data) => {
//     console.log("IT WORKED");
//     console.log(data);
// })
// .catch((err) => {
//     console.log("OH NO ERROR");
//     console.log(err);
// })


// League Name: La Liga - ID: 140 - DONE
// const spDiv1Standings = await getLeagueStandings('140', '2022');
// const spainStandings = new Standing(spDiv1Standings);
// spainStandings.save()
// .then((data) => {
//     console.log("IT WORKED");
//     console.log(data);
// })
// .catch((err) => {
//     console.log("OH NO ERROR");
//     console.log(err);
// })


