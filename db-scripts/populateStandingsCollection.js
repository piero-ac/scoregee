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

async function populateStandingsCollection(standings) {
	const standingsObj = parseStandingsData(standings);
	const { leagueID, leagueSeason } = standingsObj;
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
		console.log(
			`League Standings for leagueid: ${leagueID} and season: ${leagueSeason} already exists`
		);
	}
}

const season = ["2022", "2021", "2020", "2019"];
const leagues = ["39", "140", "61", "135", "78"];

// Get the standings for top 5 leagues for the past 4 years
for (let l of leagues) {
	for (let s of season) {
		const standings = await getLeagueStandings(l, s);
		populateStandingsCollection(standings);
	}
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
