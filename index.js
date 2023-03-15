import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoose = require("mongoose");
import axios from "axios";

import { Standing } from "./models/standing.js";
import { Fixture } from "./models/fixture.js";
import { Team } from "./models/team.js";
import { League } from "./models/league.js";
import { config } from "./football-api/config.js";

const cors = require("cors");

const leagueIDs = {
	epl: "Premier League",
	seriea: "Seria A",
	ligue1: "Ligue 1",
	bundesliga: "Bundesliga",
	laliga: "La Liga",
};

const ids = {
	epl: "39",
	seriea: "135",
	ligue1: "61",
	bundesliga: "78",
	laliga: "140",
};

main()
	.then(() => {
		console.log("MONGO CONNECTION OPENED");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/scoregee");

	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.static("public"));
app.use(cors());

// Sends the ScoreGee - Football Homepage
app.get("/football", (req, res) => {
	res.sendFile(__dirname + "/public/soccer.html");
});

// Sends the html file for displaying league rankings
app.get("/football/:league/:season", (req, res) => {
	res.sendFile(__dirname + "/public/league.html");
});

// Sends the data containing league information for the season
app.get("/football/:league/:season/overview", async (req, res) => {
	const { league, season } = req.params;
	const id = ids[league];

	// Get the league information for the specified league
	const leagueInfo = await League.findOne({ leagueID: `${id}` });

	// Get the standings for the specified league and season
	const standings = await Standing.findOne({
		leagueID: `${id}`,
		leagueSeason: `${season}`,
	});

	// Get the team info for all the teams in the season
	const { leagueStandings } = standings;
	const teamIDs = leagueStandings.map((obj) => obj.teamID);
	const teamsInfo = await Team.find({ teamID: { $in: teamIDs } });

	// Get the fixture information for the league and season
	const fixtures = await Fixture.find({
		"league.leagueID": id,
		"league.leagueSeason": season,
	});

	// Send an object containing the league standings and their corresponding teams
	res.json({ leagueInfo, standings, teamsInfo, fixtures });
});

// Sends the html file for displaying the fixture information
app.get("/football/:league/:season/fixture/:fixtureid", (req, res) => {
	res.sendFile(__dirname + "/public/matchinfo.html");
});

// Send data containing fixture information for the specified fixture
app.get(
	"/football/:league/:season/fixture/:fixtureid/info",
	async (req, res) => {
		const { league, season, fixtureid } = req.params;
		const id = ids[league];

		// Get the league information for the specified league
		const leagueInfo = await League.findOne({ leagueID: `${id}` });

		// Get the fixture information for the league and season
		const fixture = await Fixture.findOne({
			"league.leagueID": id,
			"league.leagueSeason": season,
			"fixture.id": fixtureid,
		});
		// console.log(fixture);
		const { teams } = fixture;
		const homeTeamInfo = await Team.find({ teamID: teams.home.teamID });
		const awayTeamInfo = await Team.find({ teamID: teams.away.teamID });

		const teamsInfo = [homeTeamInfo[0], awayTeamInfo[0]];

		// Make axios request for lineup
		const options = {
			method: "GET",
			url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups",
			params: { fixture: fixtureid },
			headers: {
				"X-RapidAPI-Key": config.RAPID_API_KEY,
				"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
			},
		};

		const lineupResponse = await axios.request(options);
		const { response: lineup } = lineupResponse.data;
		res.json({ leagueInfo, teamsInfo, fixture, lineup });
	}
);

app.get(
	"/football/:league/:season/fixture/:fixtureid/statistics",
	async (req, res) => {
		const { fixtureid } = req.params;
		const options = {
			method: "GET",
			url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
			params: { fixture: fixtureid },
			headers: {
				"X-RapidAPI-Key": config.RAPID_API_KEY,
				"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
			},
		};

		const statisticsResponse = await axios.request(options);
		const { response: statistics } = statisticsResponse.data;
		res.json({ statistics });
	}
);

app.listen(3000, () => {
	console.log("LISTENING ON PORT 3000");
});
