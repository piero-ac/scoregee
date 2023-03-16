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

const fixtureInfoPromise = fetch(
	`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`
);

const fixtureStatisticsPromise = fetch(
	`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`
);

fixtureInfoPromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => {
		const { leagueInfo, teamsInfo } = data;
		fixtureLeague.innerText = `${leagueInfo.leagueName} - ${leagueInfo.leagueCountry}`;
		leagueHomepageLink.setAttribute(
			"href",
			`/football/${leagueNameShort}/${leagueSeason}`
		);
		matchInfoTitle.innerText = `${teamsInfo[0].teamName} vs ${teamsInfo[1].teamName} Match Info`;

		return data;
	})
	.then((data) => displayFixtureInfo(data))
	.then((data) => {
		const { lineup } = data;
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
	})
	.catch((err) => console.log(err));

fixtureStatisticsPromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => {
		const { statistics } = data;
		if (statistics.length === 0) {
			matchStatisticsContainer.textContent =
				"Information is not available yet.";
		} else {
			// console.log(statistics);
			const homeTeam = statistics[0];
			const awayTeam = statistics[1];

			displayStatistics(homeTeam, matchStatisticsContainer);
			displayStatistics(awayTeam, matchStatisticsContainer);
		}
	});

function displayStatistics(objectStats, statsContainer) {
	const teamHeading = document.createElement("h4");
	teamHeading.innerText = objectStats.team.name;
	statsContainer.append(teamHeading);
	for (let stat of objectStats.statistics) {
		let { type, value } = stat;
		value = value === null ? 0 : value;
		const p = document.createElement("p");
		p.innerText = `${type}: ${value}`;
		statsContainer.append(p);
	}
	console.log(`Done displaying ${objectStats.team.name}'s stats`);
}
