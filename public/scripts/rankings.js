const leagueNameHeading = document.querySelector("#leagueName-hd");
const leagueSeasonHeading = document.querySelector("#leagueSeason-hd");
const rankingsHeading = document.querySelector("#rankings-hd");
const rankingsContainer = document.querySelector("#rankings-ctn");
const viewFixturesLink = document.querySelector("#viewfixtures");
const fixtureDatesDiv = document.querySelector("#fixture-dates-div");
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
	`http://localhost:3000/football/${leagueNameShort}/standings/${leagueSeason}`
);

responsePromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => parseData(data))
	.then(() => displayFixtureDates(fixturesObj))
	.catch((error) => {
		console.error(`Could not get league information: ${error}`);
	});

function parseData(data) {
	const { leagueInfo, standings, teamsInfo, fixtures } = data;
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

	teamInfoObj = teamsInfo;
	fixturesObj = fixtures;
}

function displayFixtureDates(fixtures) {
	const matchdates = new Set();
	for (let f of fixtures) {
		matchdates.add(f.league.leagueRound);
	}

	for (let md of matchdates) {
		const mdURL = md.split(" ").join("");
		const button = document.createElement("button");
		button.classList.add("mdButton");
		button.innerText = md;
		button.value = `${leagueNameShort}/${leagueSeason}/${mdURL}`;

		// add event listener to display button value
		button.addEventListener("click", function () {
			displayFixturesForDate(this.value, this.innerText);
		});
		fixtureDatesDiv.append(button);
	}
}

function displayFixturesForDate(buttonValue, buttonText) {
	// Set the heading for the fixture date
	fixtureDisplayDateHeading.innerText = buttonText;

	// Find the matches for the specified date
	const date = `Regular Season - ${buttonValue.substring(
		buttonValue.indexOf("-") + 1
	)}`;

	const fixtures = fixturesObj.filter((obj) => obj.league.leagueRound === date);
	console.log(fixtures);

	if (fixtures.length !== 0) {
		for (let f of fixtures) {
			const fixtureMatchInfoDiv = createFixtureContainer(f);
			fixtureDatesDiv.appendChild(fixtureMatchInfoDiv);
		}
	}
}

function createFixtureContainer(f) {
	const { fixture, teams, goals, score } = f;
	console.log(teams);
	const { home, away } = teams;

	// create fixture match info div
	const fixtureMatchInfoDiv = document.createElement("div");
	fixtureMatchInfoDiv.classList.add("fixture-match-info-div");

	// create divs for home team and away team
	const homeTeamInfoDiv = createTeamInfoDiv(home, "home");
	const awayTeamInfoDiv = createTeamInfoDiv(away, "away");

	// create div for match info
	const matchInfoDiv = createMatchInfoDiv(fixture, goals, score);

	fixtureMatchInfoDiv.appendChild(
		homeTeamInfoDiv,
		matchInfoDiv,
		awayTeamInfoDiv
	);

	return fixtureMatchInfoDiv;
}

function createTeamInfoDiv(team, type) {
	const teamInfo = teamInfoObj.find((obj) => obj.teamID === team.teamID);
	const teamInfoDiv = document.createElement("div");
	if (type === "home") {
		teamInfoDiv.classList.add("homeTeam", "team");
	} else {
		teamInfoDiv.classList.add("awayTeam", "team");
	}

	const teamLogoImg = document.createElement("img");
	teamLogoImg.setAttribute("src", teamInfo.teamLogo);
	teamLogoImg.setAttribute("alt", `Logo for ${teamInfo.teamName}`);

	const teamNamePara = document.createElement("p");
	teamNamePara.innerText = teamInfo.teamName;

	teamInfoDiv.append(teamLogoImg, teamNamePara);
	return teamInfoDiv;
}

function createMatchInfoDiv(fixture, goals, score) {
	const matchStatusLong = fixture.status.long;
	const matchStatusShort = fixture.status.short;
	const dateLong = fixture.date;

	const matchInfoDiv = document.createElement("div");
	matchInfoDiv.classList.add("match-info");

	const datePara = document.createElement("p");
	const dateShort = dateLong.substring(0, dateLong.indexOf("T"));
	datePara.innerText = dateShort;

	const timePara = document.createElement("p");
	const time = dateLong.substring(
		dateLong.indexOf("T") + 1,
		dateLong.indexOf("T") + 5
	);
	timePara.innerText = time;

	matchInfoDiv.append(datePara, timePara);

	const statusPara = document.createElement("p");
	if (matchStatusShort === "FT") {
		statusPara.innerText = `FT - ${score.fullftime.home} : ${score.fulltime.away}`;
	} else if (matchStatusShort === "HT") {
		statusPara.innerText = `HT - ${score.halftime.home} : ${score.halftime.away}`;
	} else if (matchStatusShort === "CANC") {
		statusPara.innerText = `Canceled`;
	} else if (matchStatusShort === "PST") {
		statusPara.innerText = `Postponed`;
	}

	matchInfoDiv.append(statusPara);
	return matchInfoDiv;
}
