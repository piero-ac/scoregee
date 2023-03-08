const fixtureDatesList = document.querySelector("#fixturedateslist");
const pageTitle = document.querySelector("title");
const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 3];
const leagueSeason = urlParts[urlParts.length - 1];

// Fetch the dates for fixtures for the specified league
fetch(
	`http://localhost:3000/football/${leagueNameShort}/fixtures-data/${leagueSeason}`
)
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		console.log(response.fixtures[0].fixture);
		console.log(response.fixtures[0].league);
		displayMatchdates(response);
		return response;
	})
	// .then((data) => {
	// 	displayFixturesDates(data);
	// })
	.catch((error) => {
		console.log(error);
	});

function displayFixturesDates(data) {
	const { league, leagueName, fixtures } = data;
	pageTitle.innerText = `${leagueName} Fixtures`;

	let fixtureDates = new Set();
	for (let i = 0; i < fixtures.length; i++) {
		let {
			fixture: { date },
		} = fixtures[i];
		date = date.substring(0, date.indexOf("T"));
		fixtureDates.add(date);
	}

	// Sort the dates
	fixtureDates = Array.from(fixtureDates);
	fixtureDates.sort((a, b) => a.localeCompare(b));

	// Insert all dates into the unordered list
	for (let date of fixtureDates) {
		const a = document.createElement("a");
		a.setAttribute("href", `/football/${league}/fixtures/${date}`);
		a.innerText = date;

		const li = document.createElement("li");
		li.appendChild(a);

		fixtureDatesList.appendChild(li);
	}
}

// Will parse fixtures object to display matchdates
// in the following format
// Regular Season X - (from to to)
function displayMatchdates(data) {
	let currentMatchdate = "";
	let firstDate = "";
	let lastDate = "";

	const { fixtures } = data;
	// console.log(fixtures);

	// Get the matchdates for the season
	const matchdates = new Set();
	for (let f of fixtures) {
		matchdates.add(f.league.leagueRound);
	}

	// Get the dates that encompass a matchdate
	let dates = [];
	for (let md of matchdates) {
		const datesForMD = fixtures.filter((obj) => {
			if (obj.league.leagueRound === md) {
				return obj.fixture.date;
			}
		});
		datesForMD.unshift(md);
		dates.push(datesForMD);
	}
	console.log(dates);

	// for (let d of dates) {
	// 	const matchdate = d[0]; // Regular Season X
	// 	const firstDate = parseDate(d[1].fixture.date); // First date of Regular Season X
	// 	const secondDate = parseDate(d[d.length - 1].fixture.date); // Second date of Regular Season X
	// 	console.log(`${matchdate} - (${firstDate} - ${secondDate})`);
	// }
	for (let f of fixtures) {
		// 1. check if currentMatchdate is not the same as current fixture's matchdate
		// 2. If it is not the same, then save the date and currentMatchdate
		// if it is and firstDate has already been set, then continue
		// if it is and firstDate is not already set
	}
}

function parseDate(date) {
	return date.substring(0, date.indexOf("T"));
}
