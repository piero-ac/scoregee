
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
