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
import { ids } from "./ids.js";

const cors = require("cors");

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

// Sends the About Page for ScoreGee
app.get("/football/about", (req, res) => {
	res.sendFile(__dirname + "/public/about.html")
})

// Sends the Contact Page for ScoreGee
app.get("/football/contact", (req, res) => {
	res.sendFile(__dirname + "/public/contact.html")
})

// Sends the Contact Page for ScoreGee
app.get("/football/faq", (req, res) => {
	res.sendFile(__dirname + "/public/faq.html")
})

// Sends the html file for displaying league rankings
app.get("/football/:league/:season", (req, res) => {
	res.sendFile(__dirname + "/public/league.html");
});

// Sends the html file for displaying the fixture information
app.get("/football/:league/:season/fixture/:fixtureid", (req, res) => {
	res.sendFile(__dirname + "/public/matchinfo.html");
});

// Route to obtain league information
app.get("/football/:league/:season/overview", async (req, res) => {
	const { league } = req.params;
	const id = ids[league];

	// Get the league information for the specified league
	const leagueInfo = await League.findOne({ leagueID: `${id}` });
	res.json({ leagueInfo });
});

// Route to obtain league standings for the specific season
app.get("/football/:league/:season/standings", async (req, res) => {
	const { league, season } = req.params;
	const id = ids[league];

	// Get the standings for the specified league and season
	const standings = await Standing.findOne({
		leagueID: `${id}`,
		leagueSeason: `${season}`,
	});

	// Get the team info for all the teams in the season
	const { leagueStandings } = standings;
	const teamIDs = leagueStandings.map((obj) => obj.teamID);
	const teamsInfo = await Team.find({ teamID: { $in: teamIDs } });

	res.json({ standings, teamsInfo });
});

// Route to obtain league fixtures for the specific season
app.get("/football/:league/:season/fixtures", async (req, res) => {
	const { league, season } = req.params;
	const id = ids[league];

	// Get the fixture information for the league and season
	const fixtures = await Fixture.find({
		"league.leagueID": id,
		"league.leagueSeason": season,
	});

	res.json({ fixtures });
});

// Route to obtain single fixture information
app.get(
	"/football/:league/:season/fixture/:fixtureid/info",
	async (req, res) => {
		const { league, season, fixtureid } = req.params;
		const id = ids[league];

		// Get the fixture information for the league and season
		const fixture = await Fixture.findOne({
			"league.leagueID": id,
			"league.leagueSeason": season,
			"fixture.id": fixtureid,
		});

		const { teams } = fixture;
		const homeTeamInfo = await Team.find({ teamID: teams.home.teamID });
		const awayTeamInfo = await Team.find({ teamID: teams.away.teamID });

		const teamsInfo = [homeTeamInfo[0], awayTeamInfo[0]];

		res.json({ fixture, teamsInfo });
	}
);

// Route to obtain the fixture lineup (if available)
app.get(
	"/football/:league/:season/fixture/:fixtureid/lineup",
	async (req, res) => {
		const { fixtureid } = req.params;

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

		try {
			const lineupResponse = await axios.request(options);
			const statusCode = lineupResponse.status;

			if(statusCode === 200) {
				const { response: lineup } = lineupResponse.data;
				res.status(statusCode).json({ lineup });
			} else if (statusCode === 204) {
				res.status(statusCode).json({ lineup: [] });
			} else if (statusCode === 499 || statusCode === 500) {
				const errorMessage = eventsResponse.data.message;
				res.status(statusCode).json({ error: errorMessage });
			} else {
				// Unexpected status code
				const errorMessage = `Unexpected status code: ${statusCode}.`;
				res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode});
			}
		} catch (error) {
			// handle axios request error
			console.log(`Error while fetching lineups for fixture ${fixtureid}:`, error.message);
			let statusCode = 500;
			let errorMessage = 'An error occurred while fetching lineups data.';

			if(error.response) {
				statusCode = error.response.status;
				errorMessage = error.response.data.message || errorMessage;
			}

			res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode });
		}
	}
);

// Route to obtain the fixture statistics
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

		try {
			const statisticsResponse = await axios.request(options);
			const statusCode = statisticsResponse.status;

			if(statusCode === 200) {
				const { response: statistics } = statisticsResponse.data;
				res.status(statusCode).json({ statistics });
			} else if (statusCode === 204) {
				res.status(statusCode).json({ statistics: []});
			} else if (statusCode === 499 || statusCode === 500) {
				const errorMessage = eventsResponse.data.message;
				res.status(statusCode).json({ error: errorMessage });
			} else {
				// Unexpected status code
				const errorMessage = `Unexpected status code: ${statusCode}.`;
				res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode});
			}
			
		} catch (error) {
			// handle axios request error
			console.log(`Error while fetching statistics for fixture ${fixtureid}:`, error.message);
			let statusCode = 500;
			let errorMessage = 'An error occurred while fetching statistics data.';

			if(error.response) {
				statusCode = error.response.status;
				errorMessage = error.response.data.message || errorMessage;
			}

			res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode });
		}
	}
);

// Route to obtain the fixture events
app.get("/football/:league/:season/fixture/:fixtureid/events",
	async(req, res) => {
		const { fixtureid } = req.params;
		const options = {
			method: 'GET',
			url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/events',
			params: {fixture: fixtureid },
			headers: {
			  'X-RapidAPI-Key': config.RAPID_API_KEY,
			  'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
			}
		  };
		
		try {
			const eventsResponse = await axios.request(options);
			const statusCode = eventsResponse.status;

			if(statusCode === 200) {
				const { response: events } = eventsResponse.data;
				res.status(statusCode).json({ events });
			} else if (statusCode === 204) {
				res.status(statusCode).json({ events : []});
			} else if (statusCode === 499 || statusCode === 500){
				const errorMessage = eventsResponse.data.message;
				res.status(statusCode).json({ error: errorMessage });
			} else {
				// Unexpected status code
				const errorMessage = `Unexpected status code: ${statusCode}.`;
				res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode});
			}
			
		} catch (error) {
			// handle axios request error
			console.log(`Error while fetching events for fixture ${fixtureid}:`, error.message);
			let statusCode = 500;
			let errorMessage = 'An error occurred while fetching events data.';

			if(error.response) {
				statusCode = error.response.status;
				errorMessage = error.response.data.message || errorMessage;
			}

			res.status(statusCode).json({ error: errorMessage, actualStatusCode: statusCode });
		}
		
});

app.listen(3000, () => {
	console.log("LISTENING ON PORT 3000");
});
