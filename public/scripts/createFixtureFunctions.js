// Creates the containers that will go inside a fixture container
function createFixtureContainer(fixt, teamsInfo) {
	// console.log("Starting createFixtureContainer");
	const { fixture, teams, goals, score } = fixt;
	const { home: homeTeamInfo, away: awayTeamInfo } = teams;

	// create fixture match info div
	const fixtureMatchInfoDiv = document.createElement("div");
	fixtureMatchInfoDiv.classList.add("fixture-match-info-div");

	// create divs for home team and away team
	const homeTeamInfoDiv = createTeamInfoDiv(homeTeamInfo, "home", teamsInfo);
	const awayTeamInfoDiv = createTeamInfoDiv(awayTeamInfo, "away", teamsInfo);

	// create div for match info
	const matchInfoDiv = createMatchInfoDiv(fixture, goals, score, true);

	fixtureMatchInfoDiv.append(homeTeamInfoDiv, matchInfoDiv, awayTeamInfoDiv);

	// console.log("Ending createFixtureContainer");
	return fixtureMatchInfoDiv;
}

// Creates the container for the team information such as logo and name
function createTeamInfoDiv(team, type, teamInfoObj) {
	// console.log("Starting createTeamInfoDiv");

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
	// console.log("Ending createTeamInfoDiv");
	return teamInfoDiv;
}

// Creates the container for the score, time, and match status
function createMatchInfoDiv(fixture, goals, score, addfixtureLink = false) {
	// console.log("Starting createMatchInfoDiv");
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

	if (addfixtureLink === true) {
		const fixtureLink = document.createElement("a");
		fixtureLink.setAttribute(
			"href",
			`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureid}`
		);
		fixtureLink.innerText = "More Info";
		const fixturePara = document.createElement("p");
		fixturePara.append(fixtureLink);

		matchInfoDiv.append(datePara, timePara, statusPara, fixtureLink);
	} else {
		matchInfoDiv.append(datePara, timePara, statusPara);
	}

	// console.log("Ending createMatchInfoDiv");
	return matchInfoDiv;
}

function getLocalTime(dateString) {
	const date = new Date(dateString);
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function displayQuickFixtureInfo(quickInfoDataDiv, fixture) {
	// DISPLAY REFEREE, TIME, AND STADIUM
	const {
		referee,
		date: dateLong,
		venue: { name: stadiumName },
	} = fixture.fixture;

	const time = getLocalTime(dateLong);

	const refereePara = document.createElement("p");
	refereePara.innerText = referee === "NA" ? "Not Announced" : referee;

	const timePara = document.createElement("p");
	timePara.innerText = time;

	const stadiumPara = document.createElement("p");
	stadiumPara.innerText = stadiumName;

	quickInfoDataDiv.append(timePara, refereePara, stadiumPara);
}

function createSingleFixtureContainer(
	fixtureMatchInfoDiv,
	homeTeam,
	awayTeam,
	fixture
) {
	// create divs for home team and away team
	const homeTeamInfoDiv = createTeamFixtureInfo(homeTeam, "home");
	const awayTeamInfoDiv = createTeamFixtureInfo(awayTeam, "away");

	// create div for match info
	const matchInfoDiv = createMatchInfoDiv(
		fixture.fixture,
		fixture.goals,
		fixture.score
	);

	fixtureMatchInfoDiv.append(homeTeamInfoDiv, matchInfoDiv, awayTeamInfoDiv);
}

function createTeamFixtureInfo(teamInfo, type) {
	// console.log("Starting createTeamFixtureInfo");

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
	// console.log("Ending createTeamFixtureInfo");
	return teamInfoDiv;
}

function displayPlayers(players, playersDiv) {
	for (let player of players) {
		const { player: pInfo } = player; // save the player information
		const { name, number, pos, grid } = pInfo;

		// create a paragraph element to display information
		const playerP = document.createElement("p");
		playerP.innerText = `Number: ${number} Name: ${name} POS: ${pos}`;

		playersDiv.append(playerP);
	}
}

function displayFixtureInfo(data) {
	const { teamsInfo, fixture } = data;

	// DISPLAY MATCH INFO UP TOP
	const homeTeam = teamsInfo[0];
	const awayTeam = teamsInfo[1];

	createSingleFixtureContainer(
		fixtureMatchInfoDiv,
		homeTeam,
		awayTeam,
		fixture
	);
	displayQuickFixtureInfo(quickInfoData, fixture);

	return data;
}
