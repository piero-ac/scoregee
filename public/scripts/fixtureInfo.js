const matchInfoTitle = document.querySelector("#match-info-title");
const fixtureLeague = document.querySelector("#fixture-league");
const fixtureMatchInfoDiv = document.querySelector(".fixture-match-info-div");
const matchInfoSection = document.querySelector("#match-info-sct");
const quickInfoDiv = document.querySelector("#quick-info");
const quickInfoData = document.querySelector("#quick-info-data");
const leagueHomepageLink = document.querySelector("#league-hp-link");
const homeTeamCoach = document.querySelector("#homeTeam-coach");
const homeTeamStarters = document.querySelector("#homeTeam-starters");
const homeTeamSubs = document.querySelector("#homeTeam-subs");
const awayTeamCoach = document.querySelector("#awayTeam-coach");
const awayTeamStarters = document.querySelector("#awayTeam-starters");
const awayTeamSubs = document.querySelector("#awayTeam-subs");

const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 4];
const leagueSeason = urlParts[urlParts.length - 3];
const fixtureID = urlParts[urlParts.length - 1];

const fixtureInfoPromise = fetch(
	`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`
);

fixtureInfoPromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => parseData(data))
	.then((data) => displayFixtureInfo(data))
	.then((data) => displayTeamLineups(data))
	.catch((err) => console.log(err));

function parseData(data) {
	const { leagueInfo, teamsInfo, fixture, lineup } = data;
	const { leagueName, leagueCountry } = leagueInfo;
	fixtureLeague.innerText = `${leagueName} - ${leagueCountry}`;

	leagueHomepageLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/${leagueSeason}`
	);

	return { teamsInfo, fixture, lineup };
}

// Displays the time, referee, and stadium of the fixture
function displayFixtureInfo(data) {
	const { teamsInfo, fixture, lineup } = data;

	// DISPLAY MATCH INFO UP TOP
	const homeTeam = teamsInfo[0];
	const awayTeam = teamsInfo[1];

	matchInfoTitle.innerText = `${homeTeam.teamName} vs ${awayTeam.teamName} Match Info`;
	createFixtureContainer(homeTeam, awayTeam, fixture);

	// DISPLAY REFEREE, TIME, AND STADIUM
	const {
		referee,
		date: dateLong,
		venue: { name: stadiumName },
	} = fixture.fixture;

	const time = getLocalTime(dateLong);

	const refereePara = document.createElement("p");
	refereePara.innerText = referee;

	const timePara = document.createElement("p");
	timePara.innerText = time;

	const stadiumPara = document.createElement("p");
	stadiumPara.innerText = stadiumName;

	quickInfoData.append(timePara, refereePara, stadiumPara);

	return { lineup };
}

function displayTeamLineups(data) {
	const { lineup } = data;
	const {
		coach: hCoach,
		formation: hFormation,
		team: { name: hName },
	} = lineup[0];

	const {
		coach: aCoach,
		formation: aFormation,
		team: { name: aName },
	} = lineup[1];

	// Display the lineup subheaders
	homeTeamCoach.innerText = `${hName.toUpperCase()} Coach: ${
		hCoach.name
	} Formation: ${hFormation}`;
	awayTeamCoach.innerText = `${aName.toUpperCase()} Coach: ${
		aCoach.name
	} Formation: ${aFormation}`;

	// Display home team starters
	displayPlayers("home", "starters", lineup[0].startXI);

	// Display away team starters
	displayPlayers("away", "starters", lineup[1].startXI);

	// Display home team subs
	displayPlayers("home", "substitutes", lineup[0].substitutes);

	// Display away team subs
	displayPlayers("away", "substitutes", lineup[1].substitutes);
}

function displayPlayers(team, type, players) {
	for (let player of players) {
		const { player: pInfo } = player; // save the player information
		const { name, number, pos, grid } = pInfo;

		// create a paragraph element to display information
		const playerP = document.createElement("p");
		playerP.innerText = `Number: ${number} Name: ${name} POS: ${pos}`;

		// Add player information to the correct section
		if (team === "home" && type === "starters") {
			homeTeamStarters.append(playerP);
		} else if (team === "away" && type === "starters") {
			awayTeamStarters.append(playerP);
		} else if (team === "home" && type === "substitutes") {
			homeTeamSubs.append(playerP);
		} else if (team === "away" && type === "substitutes") {
			awayTeamSubs.append(playerP);
		}
	}
}

function createFixtureContainer(homeTeam, awayTeam, fixture) {
	console.log("Starting createFixtureContainer");

	// create divs for home team and away team
	const homeTeamInfoDiv = createTeamInfoDiv(homeTeam, "home");
	const awayTeamInfoDiv = createTeamInfoDiv(awayTeam, "away");

	// create div for match info
	const matchInfoDiv = createMatchInfoDiv(
		fixture.fixture,
		fixture.goals,
		fixture.score
	);

	fixtureMatchInfoDiv.append(homeTeamInfoDiv, matchInfoDiv, awayTeamInfoDiv);

	console.log("Ending createFixtureContainer");
	return fixtureMatchInfoDiv;
}

// Creates the container for the team information such as logo and name
function createTeamInfoDiv(teamInfo, type) {
	console.log("Starting createTeamInfoDiv");

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
	console.log("Ending createTeamInfoDiv");
	return teamInfoDiv;
}

// Creates the container for the score, time, and match status
function createMatchInfoDiv(fixture, goals, score) {
	console.log("Starting createMatchInfoDiv");
	const matchStatusLong = fixture.status.long;
	const matchStatusShort = fixture.status.short;
	const fixtureid = fixture.id;
	const dateLong = fixture.date;

	const matchInfoDiv = document.createElement("div");
	matchInfoDiv.classList.add("match-info");

	const datePara = document.createElement("p");
	const dateShort = dateLong.substring(0, dateLong.indexOf("T"));
	datePara.innerText = dateShort;

	const timePara = document.createElement("p");
	const time = getLocalTime(dateLong);
	timePara.innerText = time;

	const statusPara = document.createElement("p");
	if (matchStatusShort === "FT") {
		statusPara.innerText = `FT - ${score.fulltime.home} : ${score.fulltime.away}`;
	} else if (matchStatusShort === "HT") {
		statusPara.innerText = `HT - ${score.halftime.home} : ${score.halftime.away}`;
	} else if (matchStatusShort === "CANC") {
		statusPara.innerText = `Canceled`;
	} else if (matchStatusShort === "PST") {
		statusPara.innerText = `Postponed`;
	} else if (matchStatusShort === "NS") {
		statusPara.innerText = "Not Started";
	}

	matchInfoDiv.append(datePara, timePara, statusPara);

	console.log("Ending createMatchInfoDiv");
	return matchInfoDiv;
}

function getLocalTime(dateString) {
	const date = new Date(dateString);
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
}
