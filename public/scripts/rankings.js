const leagueNameHeading = document.querySelector("#leagueName-hd");
const rankingsHeading = document.querySelector("#rankings-hd");
const rankingsContainer = document.querySelector("#rankings-ctn");
const viewFixturesLink = document.querySelector("#viewfixtures");
const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 1];

// Fetch the rankings for the specified league
fetch(`http://localhost:3000/football/${leagueNameShort}/standings`)
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
	const { leagueName, leagueID, leagueSeason, leagueStandings } = data;
	leagueNameHeading.innerText = leagueName;
	rankingsHeading.innerText = `${leagueName} Rankings ${leagueSeason} Season`;
	viewFixturesLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/fixtures`
	);
	for (let team of leagueStandings) {
		const { teamID, teamName, teamPoints, teamRanking } = team;
		const p = document.createElement("p");
		p.innerText = `${teamRanking}. ${teamName} - ${teamPoints}`;
		rankingsContainer.appendChild(p);
	}
}
