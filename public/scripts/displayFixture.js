import { createMatchInfoDiv } from "./displayFixtures.js";
import { getLocalTime } from "./formatTime.js";

export function displayTeamCoaches(lineupObj, matchLineupContainer, coachContainers, playerContainers){
    if (lineupObj.length === 0) {
		matchLineupContainer.textContent = "Information is not available.";
	} else {
		// Reset coach containers
		coachContainers[0].innerHTML = "";
		coachContainers[1].innerHTML = "";

		// Reset lineup containers
		playerContainers[0].innerHTML = `<h3>Starters</h3>`;
		playerContainers[1].innerHTML = `<h3>Substitutes</h3>`;
		playerContainers[2].innerHTML = `<h3>Starters</h3>`;
		playerContainers[3].innerHTML = `<h3>Substitutes</h3>`;

		const {
			coach: hCoach,
			formation: hFormation,
			team: { name: hName },
		} = lineupObj[0];

		const {
			coach: aCoach,
			formation: aFormation,
			team: { name: aName },
		} = lineupObj[1];

		// Display the lineup subheaders
	    coachContainers[0].innerText = `${hName.toUpperCase()} Coach: ${
			hCoach.name
		} Formation: ${hFormation}`;
		coachContainers[1].innerText = `${aName.toUpperCase()} Coach: ${
			aCoach.name
		} Formation: ${aFormation}`;

		// Display home team starters
		displayPlayers(lineupObj[0].startXI, playerContainers[0]);

		// Display away team starters
		displayPlayers(lineupObj[1].startXI, playerContainers[2]);

		// Display home team subs
		displayPlayers(lineupObj[0].substitutes, playerContainers[1]);

		// Display away team subs
		displayPlayers(lineupObj[1].substitutes, playerContainers[3]);
	}
}

export function displayStatisticsStatus(statisticsObj, matchStatisticsContainer){
    if(statisticsObj.length === 0){
        matchStatisticsContainer.textContent = "Information is not available.";
    } else {
		matchStatisticsContainer.innerHTML = ""; // reset the stats container to be empty
        const homeTeam = statisticsObj[0];
		const awayTeam = statisticsObj[1];

		displayStatisticsForTeam(homeTeam, matchStatisticsContainer, "home");
		displayStatisticsForTeam(awayTeam, matchStatisticsContainer, "away");
    }
}

export function displayFixtureTitle(leagueInfo, teamsInfo, leagueDisplay, leagueHPLink, fixtureInfoTitle, leagueNameShort, leagueSeason){
    leagueDisplay.innerText = `${leagueInfo.leagueInfo.leagueName} - ${leagueInfo.leagueInfo.leagueCountry}`;
	leagueHPLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/${leagueSeason}`
	);
	fixtureInfoTitle.innerText = `${teamsInfo[0].teamName} vs ${teamsInfo[1].teamName} Match Info`;
}

export function displayFixtureInfo(data, quickInfoDataDiv, fixtureMatchInfoDiv){
    const { teamsInfo, fixture } = data;

	// set the color of the fixtureMatchInfoDiv based on fixture states
	fixtureMatchInfoDiv.className = "";
	fixtureMatchInfoDiv.classList.add("fixture-match-info-div");

	const inPlayStatusCodes = ["1H", "HT", "2H", "ET", "BT", "P", "INT"];
	const matchStatus = fixture.fixture.status.short;
	if(inPlayStatusCodes.includes(matchStatus)){
		if(matchStatus === "HT"){
			fixtureMatchInfoDiv.classList.add("blue-border-pulse");
		} else {
			fixtureMatchInfoDiv.classList.add("green-border-pulse");
		}
	} else {
		fixtureMatchInfoDiv.classList.add("red-border-pulse");
	}

	// DISPLAY MATCH INFO UP TOP
	const homeTeam = teamsInfo[0];
	const awayTeam = teamsInfo[1];

	createSingleFixtureContainer(
		fixtureMatchInfoDiv,
		homeTeam,
		awayTeam,
		fixture
	);
	quickInfoDataDiv.innerHTML = ""; // reset quick info data div
	displayQuickFixtureInfo(quickInfoDataDiv, fixture);

	return data;
}

export function displayQuickFixtureInfo(quickInfoDataDiv, fixture) {
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

function displayStatisticsForTeam(objectStats, statsContainer, type){
    const teamStatsDiv = document.createElement("div");
	if (type === "home") teamStatsDiv.classList.add("homeTeam-stats");
	else teamStatsDiv.classList.add("awayTeam-stats");

	const teamHeading = document.createElement("h4");
	teamHeading.innerText = objectStats.team.name;
	teamStatsDiv.append(teamHeading);

	for (let stat of objectStats.statistics) {
		const statsDiv = createTeamStatsContainer(stat);
		teamStatsDiv.append(statsDiv);
	}

	statsContainer.append(teamStatsDiv);
	console.log(`Done displaying ${objectStats.team.name}'s stats`);
}

function createTeamStatsContainer(stat){
    const statsDiv = document.createElement("div");
	statsDiv.classList.add("stats");

	let { type, value } = stat;
	value = value === null ? 0 : value;
	const statType = document.createElement("p");
	statType.classList.add("stat-type");
	statType.innerText = type;

	const statValue = document.createElement("p");
	statValue.classList.add("stat-value");
	statValue.innerText = value;

	statsDiv.append(statType, statValue);
	return statsDiv;
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

	fixtureMatchInfoDiv.innerHTML = ""; // reset the information in fixture match info div
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

export function displayFixtureEvents(fixtureEvents, matchEventsContainer){
	if(fixtureEvents.length === 0){
		matchEventsContainer.textContent = "Information is not available."
	} else {
		matchEventsContainer.innerHTML = ""; // Reset matchEventsContainers

		// create table
		const eventsTable = document.createElement("table");
		eventsTable.setAttribute("id", "events-table");

		// create table headings row
		createEventsTableHeadings(eventsTable);

		// create event rows
		for(let event of fixtureEvents){
			const eventRow = createEventRow(event);
			eventsTable.append(eventRow);
		}

		matchEventsContainer.append(eventsTable);
	}
}

function createEventsTableHeadings(eventsTable){
	// create table headings row
	const headingsRow = document.createElement("tr");
	
	const timeHeading = document.createElement("th");
	timeHeading.classList.add("event-hd-small");
	timeHeading.innerText = "Time";
		
	const teamHeading = document.createElement("th");
	teamHeading.classList.add("event-hd-medium");
	teamHeading.innerText = "Team";
		
	const eventHeading = document.createElement("th");
	eventHeading.classList.add("event-hd-medium");
	eventHeading.innerText = "Event";
		
	const infoHeading = document.createElement("th");
	infoHeading.classList.add("event-hd-large");
	infoHeading.innerText = "Info";
		
	headingsRow.append(timeHeading, teamHeading, eventHeading, infoHeading);
	eventsTable.append(headingsRow);
}

function createEventRow(event){
	const eventType = event.type;
	const eventTypeDetails = event.detail;
	const eventAssistName = event.assist.name;
	const timeElapsed = event.time.elapsed;
	const timeExtra = event.time.extra;
	const teamName = event.team.name;
	const teamLogoLink = event.team.logo;
	const playerName = event.player.name;

	const eventRow = document.createElement("tr");
	eventRow.classList.add("event-row");

	const timeData = document.createElement("td");
	if(timeExtra){
		timeData.innerText = `${timeElapsed}+${timeExtra}'`;
	} else {
		timeData.innerText = `${timeElapsed}'`;
	}

	const teamLogoData = document.createElement("td");
	const teamLogoImg = document.createElement("img");
	teamLogoImg.classList.add("event-team-img");
	teamLogoImg.setAttribute("src", teamLogoLink);
	teamLogoImg.setAttribute("alt", `Logo of ${teamName}`);
	teamLogoData.append(teamLogoImg);

	const eventTypeData = document.createElement("td");
	const eventTypeImg = document.createElement("img");
	eventTypeImg.classList.add("event-type");

	if(eventType === "Card"){
		if(eventTypeDetails === "Yellow Card"){
			eventTypeImg.setAttribute("src", "/images/yellow-card.png");
			eventTypeImg.setAttribute("alt", "Image of Yellow Card");
		} else if (eventTypeDetails === "Red Card"){
			eventTypeImg.setAttribute("src", "/images/red.png");
			eventTypeImg.setAttribute("alt", "Image of Red Card");
		}
	} else if (eventType === "Goal"){
		eventTypeImg.setAttribute("src", "/images/soccer-ball.png");
		eventTypeImg.setAttribute("alt", "Image of Soccer Ball (indicating a goal)");
	} else if (eventType === "subst") {
		eventTypeImg.setAttribute("src", "/images/substitution.png");
		eventTypeImg.setAttribute("alt", "Image of a Substitution Taking Place");
	} else if (eventType == "var"){
		eventTypeImg.setAttribute("src", "/images/var.png");
		eventTypeImg.setAttribute("alt", "Image of a Virtual Assistant Referee Call");
	}
	eventTypeData.append(eventTypeImg);

	const infoData = document.createElement("td");
	if(eventType === "Card"){
		infoData.innerText = playerName;
	} else if (eventType === "Goal") {
		let goalInfo = `Scorer: ${playerName} `;
		if(eventAssistName){
			goalInfo += `Assist: ${eventAssistName}`;
		}
		infoData.innerText = goalInfo;
	} else if (eventType === "subst") {
		infoData.innerText = `Out: ${eventAssistName} In: ${playerName}`;
	} else if (eventType == "var") {
		infoData.innerText = `VAR Decision: ${eventTypeDetails}`;
	}

	eventRow.append(timeData, teamLogoData, eventTypeData, infoData);
	return eventRow;
}