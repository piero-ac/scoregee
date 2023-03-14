const leagueNameHeading = document.querySelector("#leagueName-hd");
const leagueSeasonHeading = document.querySelector("#leagueSeason-hd");
const rankingsHeading = document.querySelector("#rankings-hd");
const rankingsContainer = document.querySelector("#rankings-ctn");
// const viewFixturesLink = document.querySelector("#viewfixtures");
const fixtureDatesDiv = document.querySelector("#fixture-dates-div");
const fixturesForDateDiv = document.querySelector("#fixtures-for-date");
const fixtureDisplayDateHeading = document.querySelector(
	"#fixture-display-date-hd"
);
const fixturesForDate = document.querySelector("#fixtures-for-date");

const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 2];
const leagueSeason = urlParts[urlParts.length - 1];

let teamInfoObj;
let fixturesObj;

// make request for data to backend
const responsePromise = fetch(
	`/football/${leagueNameShort}/${leagueSeason}/overview`
);

responsePromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => {
		// Display the League Name and Season
		leagueNameHeading.innerText = data.leagueInfo.leagueName;
		const season = parseInt(data.standings.leagueSeason);
		leagueSeasonHeading.innerText = `${season}-${season + 1} Season`;
		return data;
	})
	.then((data) => {
		const { standings, teamsInfo } = data;
		displayLeagueStandings(rankingsContainer, standings, teamsInfo);
		return data;
	})
	.then((data) => {
		const { fixtures, teamsInfo } = data;
		displayFixtureDates(
			fixtureDatesDiv,
			fixtures,
			teamsInfo,
			leagueNameShort,
			leagueSeason,
			fixtureDisplayDateHeading,
			fixturesForDateDiv
		);
		return data;
	})
	.catch((error) => {
		console.error(`Could not get league information: ${error}`);
	});
