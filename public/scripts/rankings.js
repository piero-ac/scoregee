const leagueNameHeading = document.querySelector("#leagueName-hd");
const rankingsHeading = document.querySelector("#rankings-hd");
const rankingsContainer = document.querySelector("#rankings-ctn");
const viewFixturesLink = document.querySelector("#viewfixtures");
const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 2];
const leagueSeason = urlParts[urlParts.length - 1];

// Fetch the rankings for the specified league
fetch(
	`http://localhost:3000/football/${leagueNameShort}/standings/${leagueSeason}`
)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		displayRankings(data);
	})
	.catch((error) => {
		console.log(error);
	});

function displayRankings(data) {
	const { leagueInfo, standings, teamsInfo } = data;
	const { leagueID, leagueName, leagueCountry, leagueLogo } = leagueInfo;
	const { leagueSeason, leagueStandings } = standings;

	leagueNameHeading.innerText = leagueName;
	rankingsHeading.innerText = `${leagueName} Rankings ${leagueSeason} Season`;
	viewFixturesLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/fixtures`
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
