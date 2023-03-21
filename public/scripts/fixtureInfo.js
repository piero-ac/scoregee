const matchInfoTitle = document.querySelector("#match-info-title");
const fixtureLeague = document.querySelector("#fixture-league");
const fixtureMatchInfoDiv = document.querySelector(".fixture-match-info-div");
const matchInfoSection = document.querySelector("#match-info-sct");
const matchLineupContainer = document.querySelector("#match-lineup");
const matchStatisticsContainer = document.querySelector("#match-statistics");
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

let leagueInfoAvailable = false;
let leagueFixtureAvailable = false;
let fixtureLineupsAvailable = false;
let fixtureStatisticsAvailable = false;

getFixtureInfo();

function displayStatistics(objectStats, statsContainer, type) {
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

function createTeamStatsContainer(stat) {
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

async function getFixtureInfo() {
	// obtain the league information
	const leagueInfo = await fetch(
		`/football/${leagueNameShort}/${leagueSeason}/overview`
	)
		.then((response) => {
			leagueInfoAvailable = true;
			return response.json();
		})
		.catch((error) => {
			leagueInfoAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});

	const { fixture, teamsInfo } = await fetch(
		`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`
	)
		.then((response) => {
			leagueFixtureAvailable = true;
			return response.json();
		})
		.catch((error) => {
			leagueFixtureAvailable = false;
			console.error(`Could not get league fixture and teams info: ${error}`);
		});

	const { lineup: fixtureLineup } = await fetch(
		`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/lineup`
	)
		.then((response) => {
			fixtureLineupsAvailable = true;
			return response.json();
		})
		.catch((error) => {
			fixtureLineupsAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});

	const { statistics: fixtureStatistics } = await fetch(
		`/football/{leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`
	)
		.then((response) => {
			fixtureStatisticsAvailable = true;
			return response.json();
		})
		.catch((error) => {
			fixtureStatisticsAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});

	displayFixtureTitle(leagueInfo, teamsInfo);
	displayFixtureInfo({ teamsInfo, fixture });
	displayTeamCoaches(fixtureLineup);
	displayStatisticsStatus(fixtureStatistics);
}

function displayFixtureTitle(leagueInfo, teamsInfo) {
	fixtureLeague.innerText = `${leagueInfo.leagueInfo.leagueName} - ${leagueInfo.leagueInfo.leagueCountry}`;
	leagueHomepageLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/${leagueSeason}`
	);
	matchInfoTitle.innerText = `${teamsInfo[0].teamName} vs ${teamsInfo[1].teamName} Match Info`;
}

function displayTeamCoaches(lineup) {
	if (lineup.length === 0) {
		matchLineupContainer.textContent = "Information is not available yet.";
	} else {
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
		displayPlayers(lineup[0].startXI, homeTeamStarters);

		// Display away team starters
		displayPlayers(lineup[1].startXI, awayTeamStarters);

		// Display home team subs
		displayPlayers(lineup[0].substitutes, homeTeamSubs);

		// Display away team subs
		displayPlayers(lineup[1].substitutes, awayTeamSubs);
	}
}

function displayStatisticsStatus(statistics) {
	if (statistics.length === 0) {
		matchStatisticsContainer.textContent = "Information is not available yet.";
	} else {
		// console.log(statistics);
		const homeTeam = statistics[0];
		const awayTeam = statistics[1];

		displayStatistics(homeTeam, matchStatisticsContainer, "home");
		displayStatistics(awayTeam, matchStatisticsContainer, "away");
	}
}
