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

let leagueInfoAvailable = false;
let leagueFixturesAvailable = false;
let leagueStandingsAndInfoAvailable = false;

// Import standings functions
import { displayLeagueStandings, mapTeamsForLeagueStandings } from "./displayStandings.js";

getLeagueInfo();

async function getLeagueInfo() {
	// obtain the league information
	const leagueInfo = await fetch(
		`/football/${leagueNameShort}/${leagueSeason}/overview`
	)
		.then((response) => {
			leagueInfoAvailable = true;
			return response.json();
		})
		.catch((error) => {
			leagueInfoAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});

	// obtain the league standings
	const { standings: leagueStandings, teamsInfo: leagueTeamsInfo } =
		await fetch(`/football/${leagueNameShort}/${leagueSeason}/standings`)
			.then((response) => {
				leagueStandingsAndInfoAvailable = true;
				return response.json();
			})
			.catch((error) => {
				console.error(
					`Could not get league standings and teams info: ${error}`
				);
			});
	
	const mappedLeagueStandings = mapTeamsForLeagueStandings(leagueStandings, leagueTeamsInfo);

	// obtain the league fixtures
	const { fixtures: leagueFixtures } = await fetch(
		`/football/${leagueNameShort}/${leagueSeason}/fixtures`
	)
		.then((response) => {
			leagueFixturesAvailable = true;
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league fixtures: ${error}`);
		});

	displayLeagueInfo(leagueInfo, leagueStandings);
	displayLeagueStandings(mappedLeagueStandings, rankingsContainer);

	displayFixtureDates(
		fixtureDatesDiv,
		leagueFixtures,
		leagueTeamsInfo,
		leagueNameShort,
		leagueSeason,
		fixtureDisplayDateHeading,
		fixturesForDateDiv
	);
}

function displayLeagueInfo(leagueInfo, standings) {
	// Display the League Name and Season
	leagueNameHeading.innerText = leagueInfo.leagueInfo.leagueName;
	const season = parseInt(standings.leagueSeason);
	leagueSeasonHeading.innerText = `${season}-${season + 1} Season`;
}
