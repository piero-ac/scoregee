const leagueNameHeading = document.querySelector("#leagueName-hd");
const leagueSeasonHeading = document.querySelector("#leagueSeason-hd");
const rankingsHeading = document.querySelector("#rankings-hd");
const rankingsContainer = document.querySelector("#rankings-ctn");
const viewFixturesLink = document.querySelector("#viewfixtures");
const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 2];
const leagueSeason = urlParts[urlParts.length - 1];

let teamInfoObj;
let fixturesObj;

// make request for data to backend
const responsePromise = fetch(
	`http://localhost:3000/football/${leagueNameShort}/standings/${leagueSeason}`
);

responsePromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => displayRankings(data))
	.catch((error) => {
		console.error(`Could not get league information: ${error}`);
	});

function displayRankings(data) {
	const { leagueInfo, standings, teamsInfo } = data;
	const { leagueID, leagueName, leagueCountry, leagueLogo } = leagueInfo;
	const { leagueSeason, leagueStandings } = standings;

	leagueNameHeading.innerText = leagueName;

	const season = `${leagueSeason}-${parseInt(leagueSeason) + 1} Season`;
	leagueSeasonHeading.innerText = season;
	// rankingsHeading.innerText = `${leagueName} Rankings ${leagueSeason} Season`;
	viewFixturesLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/fixtures/${leagueSeason}`
	);

	// Parse through the leagueStandings obj
	for (let team of leagueStandings) {
		const { teamID, teamPoints, teamRanking } = team;
		const teamInformation = teamsInfo.find((obj) => teamID == obj.teamID); // find the obj with matching teamID
		const { teamName, teamCode } = teamInformation;

		//Create the paragraph element
		const p = document.createElement("p");
		p.innerText = `${teamRanking}. ${teamName} (${teamCode}) - ${teamPoints}`;
		rankingsContainer.appendChild(p);
	}
}
