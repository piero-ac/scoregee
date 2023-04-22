// This Script will update fixtures that match the current date every 3 minutes
/**
 * Possible Algorithm to Update Fixtures every 5 minutes only for leagues having fixtures that date
 * 1. Query Fixtures Table for all fixtures that match current date
 * 2. Call Route for Fixtures from several fixtures ids every 5 minutes
 *  3. Update DB information only for those fixtures
 */

import mongoose from "mongoose";
import { Fixture } from "../models/fixture.js";
import axios from "axios";
import { config } from "../football-api/config.js";

main()
	.then(() => {
		console.log("MONGO CONNECTION OPENED");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/scoregee");
}



async function findFixturesForCurrentDate(){
    const currentDate = new Date().toJSON().slice(0,10);
    console.log(currentDate);
    const fixtures = await Fixture.find({ "fixture.date" : { $regex:`.*${currentDate}.*` }});
    
    if(fixtures.length === 0){
        return [];
    } else {
        const fixtureIDs = fixtures.map(obj => obj.fixture.id );
		const parsedFixtureIDs = splitFixtureIDs(fixtureIDs);
        console.log(`Will update following fixtures: ${fixtureIDs}`);
        return parsedFixtureIDs;
    }
}

function parseFixtureData(data) {
	const fixtures = [];

	for (let fixt of data) {
		let { fixture: f, league: l, teams: t, goals, score } = fixt;

		// create fixture subdocument
		const { id, timezone, referee, date, venue, status } = f;
		let fixture = { id, referee, timezone, date, venue, status };

		// create league subdocument
		const { id: leagueID, season: leagueSeason, round: leagueRound } = l;
		let league = { leagueID, leagueSeason, leagueRound };

		// create teams subdocument
		let teams = {
			home: {
				teamID: t.home.id,
				winner: t.home.winner,
			},
			away: {
				teamID: t.away.id,
				winner: t.away.winner,
			},
		};
		// goals and score subdocument structure are identical to API

		// replace null values in object
		fixture = replaceNull(fixture, "NA");
		league = replaceNull(league, "NA");
		teams = replaceNull(teams, "NA");
		goals = replaceNull(goals, "NA");
		score = replaceNull(score, "NA");

		// push object ( db document) to fixtures array
		fixtures.push({ fixture, league, teams, goals, score });
	}

	return fixtures;
}

function replaceNull(obj, replacement) {
	for (let prop in obj) {
		if (obj[prop] === null) {
			obj[prop] = replacement;
		} else if (typeof obj[prop] === "object") {
			replaceNull(obj[prop], replacement);
		}
	}
	return obj;
}

async function getFixturesFromID(ids){
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {ids: ids},
        headers: {
          'X-RapidAPI-Key': config.RAPID_API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      };

    const response = await axios.request(options);
	console.log(response.status);
	console.log(response.data.response);
	return response.data.response;
}


async function updateSpecificFixtures(fixtures) {
	for (const fixt of fixtures) {
        const { fixture: { id: fixtureID } } = fixt;
			Fixture.updateOne({ "fixture.id": fixtureID }, fixt)
				.then(() => console.log(`Updated fixture with id: ${fixtureID}`))
				.catch((err) => console.log(`Error updating fixture`, err));
	}
}

// should update 882075, 878224, 868249
async function updateFixtures(){
    const currentTimeDate = new Date().toJSON();
    // Step 1. Get the fixtures for the current date
    const ids = await findFixturesForCurrentDate();

    if(ids.length !== 0){
        console.log(`Updating fixtures. Current Time and Date is: ${currentTimeDate}`);

		for(let idString of ids){
			// Step 2. Call route to get fixture information for specified ids
			const fixturesNotParsed = await getFixturesFromID(idString);
			// Step 3. Parse the data
			const fixturesParsed = parseFixtureData(fixturesNotParsed);
			// console.log(fixturesParsed);
			// Step 4. Update the fixtures 
			updateSpecificFixtures(fixturesParsed);
		}
        return true;
    } else {
        console.log("No fixtures happening today");
        return false;
    }
}

function splitFixtureIDs(fixtureIDs){
	const MAX_LENGTH = 20;
	const numSubarrays = Math.ceil(fixtureIDs.length / MAX_LENGTH);
	const result = [];

	for (let i = 0; i < numSubarrays; i++) {
		const start = i * MAX_LENGTH;
		const end = start + MAX_LENGTH;
		const subarray = fixtureIDs.slice(start, end);
		const subarrayString = subarray.join("-");
		result.push(subarrayString);
	}

	return result;
}

// Call update fixtures initially
const fixturesOccuringToday = await updateFixtures();

// Check if fixtures are occuring today, before calling setInterval
if(fixturesOccuringToday){
    // Set an interval to call updateFixtures every 3 minutes
    const interval = setInterval(updateFixtures, 120000); // 3 * 60 * 1000

    // Clear the interval after 8 hours
    setTimeout(() => {
        clearInterval(interval);
    }, 28800000); // 8 * 60 * 60 * 1000
}