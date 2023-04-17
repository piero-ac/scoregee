import mongoose from "mongoose";
import { Standing } from "../models/standing.js";
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

async function getLeagueStandings(id, season) {
	const options = {
		method: "GET",
		url: "https://api-football-v1.p.rapidapi.com/v3/standings",
		params: { league: id, season: season },
		headers: {
			"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
			"x-rapidapi-key": config.RAPID_API_KEY,
		},
	};
	const response = await axios.request(options);
	return response.data.response[0].league;
}

function parseStandingsData(leagueStdg) {
	const { id: leagueID, season: leagueSeason, standings } = leagueStdg;
	const leagueStandings = [];
	for (let t of standings[0]) {
		const {
			rank: teamRanking,
			team: { id: teamID },
			points: teamPoints,
		} = t;

		leagueStandings.push({ teamID, teamPoints, teamRanking });
	}
	return { leagueID, leagueSeason, leagueStandings };
}

async function checkLeagueSeasonStandingsExists(leagueID, season) {
	const leagueStanding = await Standing.find({
		leagueID: leagueID,
		leagueSeason: season,
	});
	return leagueStanding.length !== 0;
}

async function updateStandingsCollection(standings) {
	const standingsObj = parseStandingsData(standings);
	const { leagueID, leagueSeason, leagueStandings } = standingsObj;
	const standingsExists = await checkLeagueSeasonStandingsExists(
		leagueID,
		leagueSeason
	);
	if (!standingsExists) {
		const newStandings = new Standing(standingsObj);
		newStandings
			.save()
			.then(() =>
				console.log(
					`Saved league standings for leagueid: ${leagueID} and season: ${leagueSeason}`
				)
			)
			.catch((err) => console.log("Error saving standings", err));
	} else {
		// Update only the league standings value, not the entire document
		Standing.updateOne(
			{ leagueID: leagueID, leagueSeason: leagueSeason },
			{ $set: { leagueStandings: leagueStandings } }
		)
			.exec()
			.then(() =>
				console.log(
					`Updated league standings for leagueid: ${leagueID} and season: ${leagueSeason}`
				)
			)
			.catch((err) => console.log(`Error updating standings`, err));
	}
}

const leagues = ["39", "140", "61", "135", "78"];

for (let l of leagues) {
	const standings = await getLeagueStandings(l, "2022");
	updateStandingsCollection(standings);
}

/**
 * Recommended Calls : 1 call per hour for the leagues or teams who have at least one fixture in progress otherwise 1 call per day.
 */
