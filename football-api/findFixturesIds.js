// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");
import { config } from "./config.js";
const fs = require("fs");

async function getFixtureIDs(leagueid, season) {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    params: { league: leagueid, season: season },
    headers: {
      "X-RapidAPI-Key": config.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  const response = await axios.request(options);
  const data = response.data.response;
  const fixtureIDs = [];
  for (let i = 0; i < data.length; i++) {
    const {
      fixture: { id: fixtureID },
    } = data[i];
    fixtureIDs.push(fixtureID);
  }
  return fixtureIDs;
}

// const eplFixtureIDs = await getFixtureIDs("39", "2022");
// const serieaFixtureIDs = await getFixtureIDs("135", "2022");
// const ligue1FixtureIDs = await getFixtureIDs("61", "2022");
// const bundesligaFixtureIDs = await getFixtureIDs("78", "2022");
// const laligaFixtureIDs = await getFixtureIDs("140", "2022");

// create writestream
// const eplWriteStream = fs.createWriteStream("eplFixtureIDs.txt");
// const serieaWriteStream = fs.createWriteStream("serieaFixtureIDs.txt");
// const ligue1WriteStream = fs.createWriteStream("ligue1FixtureIDs.txt");
// const bundesligaWriteStream = fs.createWriteStream("bundesligaFixtureIDs.txt");
// const laligaWriteStream = fs.createWriteStream("laligaFixtureIDs.txt");

// eplFixtureIDs.forEach((id) => eplWriteStream.write(`${id}\n`));
// eplWriteStream.on("finish", () => {
//   console.log("wrote all the epl fixture ids");
// });
// eplWriteStream.on("error", (err) => {
//   console.error("There is an error writing the file for epl fixture ids", err);
// });
// eplWriteStream.end();

// serieaFixtureIDs.forEach((id) => serieaWriteStream.write(`${id}\n`));
// serieaWriteStream.on("finish", () => {
//   console.log("wrote all the seriea fixture ids");
// });
// serieaWriteStream.on("error", (err) => {
//   console.error(
//     "There is an error writing the file for seriea fixture ids",
//     err
//   );
// });
// serieaWriteStream.end();

// ligue1FixtureIDs.forEach((id) => ligue1WriteStream.write(`${id}\n`));
// ligue1WriteStream.on("finish", () => {
//   console.log("wrote all the ligue1 fixture ids");
// });
// ligue1WriteStream.on("error", (err) => {
//   console.error(
//     "There is an error writing the file for ligue1 fixture ids",
//     err
//   );
// });
// ligue1WriteStream.end();

// bundesligaFixtureIDs.forEach((id) => bundesligaWriteStream.write(`${id}\n`));
// bundesligaWriteStream.on("finish", () => {
//   console.log("wrote all the bundesliga fixture ids");
// });
// bundesligaWriteStream.on("error", (err) => {
//   console.error(
//     "There is an error writing the file for bundesliga fixture ids",
//     err
//   );
// });
// bundesligaWriteStream.end();

// laligaFixtureIDs.forEach((id) => laligaWriteStream.write(`${id}\n`));
// laligaWriteStream.on("finish", () => {
//   console.log("wrote all the laliga fixture ids");
// });
// laligaWriteStream.on("error", (err) => {
//   console.error(
//     "There is an error writing the file for laliga fixture ids",
//     err
//   );
// });
// laligaWriteStream.end();
