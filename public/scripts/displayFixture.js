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
		for(let event of fixtureEvents){
			const type = event.type;
			const time = event.time.elapsed;
			const team = event.team.id;
			const name = event.team.name;
			const logo = event.team.logo;
			const pid = event.player.id;
			const player = event.player.name;
			const detail = event.detail;
			const comments = event.comments;
			const ai = event.assist.id;
			const an = event.assist.name;
			let output = `${time}' ${player} `;
			if (type === "Card") {
				output += `${detail} `;
			} else if (type === "subst") {
				output += 'Substitution ' ;
			} else if (type === "Goal") {
				output += 'Goal' ;
			} else if (type === "Var") {
				output += `VAR - ${detail}`;
			}

			const eventParagraph = document.createElement("p");
			eventParagraph.textContent = output;
			matchEventsContainer.append(eventParagraph); 
		}
	}
}
