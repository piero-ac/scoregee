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

// Function to get all the fixtures for the specified league and season
async function getLeagueSeasonFixtures(id, season) {
	const options = {
		method: "GET",
		url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
		params: { league: id, season: season },
		headers: {
			"X-RapidAPI-Key": config.RAPID_API_KEY,
			"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
		},
	};

	const response = await axios.request(options);
	return response.data.response;
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

async function checkLeagueSeasonFixtureExists(fixtureID) {
	const fixture = await Fixture.find({ "fixture.id": fixtureID });
	return fixture.length !== 0;
}

// Insert fixture information individually
async function populateFixturesCollection(fixtures) {
	const fixturesArr = parseFixtureData(fixtures);
	for (const fixt of fixturesArr) {
		const {
			fixture: { id: fixtureID },
		} = fixt;
		const fixtureExists = await checkLeagueSeasonFixtureExists(fixtureID);
		if (!fixtureExists) {
			const newFixture = new Fixture(fixt);
			newFixture
				.save()
				.then(() => console.log(`Saved fixture with id: ${fixtureID}`))
				.catch((err) => console.log(`Error saving fixture`, err));
		} else {
			console.log(`Fixture information already exists, ID: ${fixtureID}`);
		}
	}
}

async function updateFixturesCollection(fixtures) {
	const fixturesArr = parseFixtureData(fixtures);
	for (const fixt of fixturesArr) {
		const {
			fixture: { id: fixtureID },
		} = fixt;
		const fixtureExists = await checkLeagueSeasonFixtureExists(fixtureID);
		if (!fixtureExists) {
			const newFixture = new Fixture(fixt);
			newFixture
				.save()
				.then(() => console.log(`Saved fixture with id: ${fixtureID}`))
				.catch((err) => console.log(`Error saving fixture`, err));
		} else {
			Fixture.updateOne({ "fixture.id": fixtureID }, fixt)
				.then(() => console.log(`Updated fixture with id: ${fixtureID}`))
				.catch((err) => console.log(`Error updating fixture`, err));
		}
	}
}

// recursive function to replace null values with NA
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

const leagues = ["39", "140", "61", "135", "78"];

// Update the fixture information for the 2022-2023 season
for (let l of leagues) {
	const fixtures = await getLeagueSeasonFixtures(l, "2022");
	updateFixturesCollection(fixtures);
}
