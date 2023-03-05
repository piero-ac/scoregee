import mongoose from "mongoose";
import { Team } from "../models/team.js";
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

async function getTeamsForLeague(leagueID, season) {
	const options = {
		method: "GET",
		url: "https://api-football-v1.p.rapidapi.com/v3/teams",
		params: { league: leagueID, season: season },
		headers: {
			"X-RapidAPI-Key": config.RAPID_API_KEY,
			"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
		},
	};

	const response = await axios.request(options);
	return response.data.response;
}

function parseTeamData(teams) {
	const teamObj = [];

	for (let t of teams) {
		const {
			team: {
				id: teamID,
				name: teamName,
				logo: teamLogo,
				code: teamCode,
				country: teamCountry,
				founded: teamFounded,
			},
		} = t;

		teamObj.push({
			teamID,
			teamName,
			teamLogo,
			teamCode,
			teamCountry,
			teamFounded,
		});
	}

	return teamObj;
}

async function populateTeamsCollection(teams) {
	const teamObj = parseTeamData(teams);
	for (let team of teamObj) {
		const teamExists = await checkTeamIdExists(team.teamID);
		if (!teamExists) {
			const newTeam = new Team(team);
			newTeam
				.save()
				.then(() => console.log(`Saved team with id: ${team.teamID}`))
				.catch((err) => console.log("Error saving team", err));
		} else {
			console.log(`Team with id: ${team.teamID} already exists`);
		}
	}
}

async function checkTeamIdExists(id) {
	const team = await Team.find({ teamID: id });
	return team.length !== 0;
}

// console.log(await checkTeamIdExists(66));
const season = ["2022", "2021", "2020", "2019"];
const leagues = ["39", "140", "61", "135", "78"];

// Get the teams that played for the past 4 years in the top 5 leagues
for (let l of leagues) {
	for (let s of season) {
		const teams = await getTeamsForLeague(l, s);
		populateTeamsCollection(teams);
	}
}
