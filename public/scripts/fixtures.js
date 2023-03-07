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
	.then((data) => {
		displayFixturesDates(data);
	})
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
