import mongoose from "mongoose";
import { League } from "../models/league.js";
import axios from "axios";
import { config } from "../football-api/config.js";

// DB Connection
main()
	.then(() => {
		console.log("MONGO CONNECTION OPENED");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/scoregee");
}

// Request league information from API-Football based on ID
async function getLeagueInformation(id) {
	const options = {
		method: "GET",
		url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
		params: { id: id },
		headers: {
			"X-RapidAPI-Key": config.RAPID_API_KEY,
			"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
		},
	};

	const response = await axios.request(options);
	return response.data.response[0];
}

// Parse through the league information object and attain required data
function parseLeagueData(leagueInfo) {
	const { league, country, seasons } = leagueInfo;
	const { id: leagueID, name: leagueName, logo: leagueLogo } = league;
	const { name: leagueCountry } = country;
	return { leagueID, leagueName, leagueCountry, leagueLogo };
}

// Check if the league information already exists in the DB
async function checkLeagueIdExists(id) {
	const league = await League.find({ leagueID: id });
	return league.length !== 0;
}

// Create a new document based on passed league information
async function populateLeaguesCollection(leagueInfo) {
	const leagueObj = parseLeagueData(leagueInfo);
	const leagueExists = await checkLeagueIdExists(leagueObj.leagueID);
	if (!leagueExists) {
		const newLeague = new League(leagueObj);
		newLeague
			.save()
			.then(() => console.log(`Saved league with id: ${leagueObj.leagueID}`))
			.catch((err) => console.log("Error saving team", err));
	} else {
		console.log(`League with id: ${leagueObj.leagueID} already exists`);
	}
}

const leagues = ["39", "140", "61", "135", "78"];

for (let l of leagues) {
	const leagueInfo = await getLeagueInformation(l);
	populateLeaguesCollection(leagueInfo);
}
