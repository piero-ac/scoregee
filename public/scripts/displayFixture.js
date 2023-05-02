import { createMatchInfoDiv } from "./displayFixtures.js";
import { getLocalTime } from "./formatTime.js";

export function displayTeamCoaches(lineupObj, matchLineupContainer, coachContainers, playerContainers){
    if (lineupObj.length === 0) {
		matchLineupContainer.textContent = "Information is not available.";
	} else {
  
		matchLineupContainer.innerText = "";

		const { coach: hCoach, formation: hFormation,team: { name: hName } } = lineupObj[0];
		const { coach: aCoach, formation: aFormation, team: { name: aName } } = lineupObj[1];
		const { startXI: homeStarters, substitutes: homeSubs }  = lineupObj[0];
		const { startXI: awayStarters, substitutes: awaySubs }  = lineupObj[1];

		const lineupTable = document.createElement("table");
		lineupTable.setAttribute("id", "lineup-table");

		// display team names, coaches, and formations
		const teamsHeadingsRow = document.createElement("tr");
		teamsHeadingsRow.append(
			createLineupTeamHeading(hName),
			createLineupTeamHeading(aName)
		);
		lineupTable.append(teamsHeadingsRow);

		const coachHeading = document.createElement("tr");
		const coachTitle = document.createElement("th");
		coachTitle.innerText = "Coach";
		coachTitle.setAttribute("colspan", "6");
		coachHeading.append(coachTitle);
		lineupTable.append(coachHeading);

		const coachNamesRow = document.createElement("tr");
		coachNamesRow.append(
			createLineupInfo(hCoach.name),
			createLineupInfo(aCoach.name)
		);
		lineupTable.append(coachNamesRow);

		const formationHeading = document.createElement("tr");
		const formationTitle = document.createElement("th");
		formationTitle.innerText = "Formation";
		formationTitle.setAttribute("colspan", "6");
		formationHeading.append(formationTitle);
		lineupTable.append(formationHeading);

		const formationsDataRow = document.createElement("tr");
		formationsDataRow.append(
			createLineupInfo(hFormation),
			createLineupInfo(aFormation)
		);
		lineupTable.append(formationsDataRow);

		// display starters and substitutes
		createPlayerRows(homeStarters, awayStarters, lineupTable, "Starters");
		createPlayerRows(homeSubs, awaySubs, lineupTable, "Substitutes");

		matchLineupContainer.append(lineupTable);
	}
}

function createPlayerRows(homeData, awayData, lineupTable, titleValue){
	const title = createLineupTitles(titleValue);
	lineupTable.append(title);
	const playerTitles = createLineupPlayerTitles();
	lineupTable.append(playerTitles);

	const maxLength = Math.max(homeData.length, awayData.length);
	for(let i = 0; i < maxLength; i++){
		const row = document.createElement("tr");
		const hPlayer = i < homeData.length ? homeData[i].player : null;
    const aPlayer = i < awayData.length ? awayData[i].player : null;
		createPlayerRow(hPlayer, row);
		createPlayerRow(aPlayer, row);
		lineupTable.append(row);
	}
}

function createLineupTitles(name){
	const row = document.createElement("tr");
	const title = document.createElement("th");
	title.setAttribute("colspan", "6");
	title.innerText = name;
	row.append(title);
	return row;
}

function createPlayerRow(player, row){
	const name = player ? player.name : '';
    const number = player ? player.number : '';
    const pos = player ? player.pos : '';
    
	const numberData = document.createElement("td");
    numberData.innerText = number;
    const nameData = document.createElement("td");
    nameData.innerText = name;
    const positionData = document.createElement("td");
    positionData.innerText = pos;
    
	row.append(numberData, nameData, positionData);
}

function createLineupPlayerTitles(){
	const row = document.createElement("tr");
	const number1 = document.createElement("th");
	number1.innerText = "Number";
	const name1 = document.createElement("th");
	name1.innerText = "Name";
	const position1 = document.createElement("th");
	position1.innerText = "Position";

	const number2 = document.createElement("th");
	number2.innerText = "Number";
	const name2 = document.createElement("th");
	name2.innerText = "Name";
	const position2 = document.createElement("th");
	position2.innerText = "Position";

	row.append(number1, name1, position1);
	row.append(number2, name2, position2);
	return row;
}

function createLineupTeamHeading(name){
	const teamHeading = document.createElement("th");
	teamHeading.setAttribute("colspan", "3");
	teamHeading.innerText = name;
	return teamHeading;
}

function createLineupInfo(name){
	const coachHeading = document.createElement("td");
	coachHeading.setAttribute("colspan", "3");
	coachHeading.innerText = name;
	return coachHeading;
}

export function displayStatisticsStatus(statisticsObj, matchStatisticsContainer){
    if(statisticsObj.length === 0){
        matchStatisticsContainer.textContent = "Information is not available.";
    } else {
		matchStatisticsContainer.innerHTML = ""; // reset the stats container to be empty
		displayStatisticsTable(statisticsObj, matchStatisticsContainer);
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

function displayStatisticsTable(statisticsObj, matchStatisticsContainer){
	const home = statisticsObj[0];
	const away = statisticsObj[1];

	// create table element
	const statsTable = document.createElement("table");
	statsTable.setAttribute("id", "statistics-table");

	// add team headings
	statsTable.append(createStatsTeamHeadings(home, away));

	// append statistics information
	createStatsRows(home, away, statsTable);

	matchStatisticsContainer.append(statsTable);
}

function createStatsTeamHeadings(home, away){
	const teamsRow = document.createElement("tr");
	const homeName = home.team.name;
	const awayName = away.team.name;

	const homeNameHeading = document.createElement("th");
	homeNameHeading.classList.add("team-title");
	homeNameHeading.innerText = homeName;

	const awayNameHeading = document.createElement("th");
	awayNameHeading.classList.add("team-title");
	awayNameHeading.innerText = awayName;

	teamsRow.append(homeNameHeading, awayNameHeading);

	return teamsRow;
}

function createStatsRows(home, away, statsTable){

	for(let i = 0; i < home.statistics.length; i++){
		const homeStatistic = home.statistics[i];
		const awayStatistic = away.statistics[i];
		let { type, value : homeValue } = homeStatistic;
		let { value: awayValue } = awayStatistic;

		if (type === "expected_goals") continue;

		homeValue = homeValue === null ? 0 : homeValue;
		awayValue = awayValue === null ? 0 : awayValue;

		// row containing stats type
		const statsHeadingRow = document.createElement("tr");
		const statsTypeData = document.createElement("th");
		statsTypeData.innerText = type.toUpperCase();
		statsTypeData.setAttribute("colspan", "2");
		statsTypeData.classList.add("stats-heading");
		statsHeadingRow.append(statsTypeData);

		// row containing stats data
		const statsValuesRow = document.createElement("tr");
		const homeTeamStat = document.createElement("td");
		homeTeamStat.innerText = homeValue;
		const awayTeamStat = document.createElement("td");
		awayTeamStat.innerText = awayValue;
		
		statsValuesRow.append(homeTeamStat, awayTeamStat);
		statsTable.append(statsHeadingRow, statsValuesRow);
	}
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
	} else if (eventType === "Var"){
		eventTypeImg.setAttribute("src", "/images/var.png");
		eventTypeImg.setAttribute("alt", "Image of a Virtual Assistant Referee Call");
	}
	eventTypeData.append(eventTypeImg);

	const infoData = document.createElement("td");
	if(eventType === "Card"){
		infoData.innerText = playerName;
	} else if (eventType === "Goal") {
		let goalInfo = `Scorer: ${playerName} <br> `;
		if(eventAssistName){
			goalInfo += `Assist: ${eventAssistName}`;
		}
		infoData.innerHTML = goalInfo;
	} else if (eventType === "subst") {
		infoData.innerHTML = `Out: ${eventAssistName} <br> In: ${playerName}`;
	} else if (eventType === "Var") {
		infoData.innerHTML = `VAR Decision <br> ${eventTypeDetails}`;
	}

	eventRow.append(timeData, teamLogoData, eventTypeData, infoData);
	return eventRow;
}