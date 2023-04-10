// Imports
import { displayTeamCoaches, displayStatisticsStatus, displayFixtureTitle, displayFixtureInfo, displayQuickFixtureInfo } from "./displayFixture.js";
import { setCacheInformationWithExpiry, getCacheInformationWithExpiry } from "./caching.js";

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
const lineupPlayerContainers = [homeTeamStarters, homeTeamSubs, awayTeamStarters, awayTeamSubs];
const lineupCoachContainers = [homeTeamCoach, awayTeamCoach];

const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 4];
const leagueSeason = urlParts[urlParts.length - 3];
const fixtureID = urlParts[urlParts.length - 1];

let leagueInfoAvailable = false;
let leagueFixtureAvailable = false;
let fixtureLineupsAvailable = false;
let fixtureStatisticsAvailable = false;
const ONGOING_LINEUP_TTL = 900000; // for ongoing matches, lineup caches only available for 15 minutes
const ONGOING_STATS_TTL = 60000; // for ongoing matches, statistics caches only available for 1 minute
const FINISHED_LINEUP_TTL = 86400000; // for finished matches, lineup caches only available for 24 hours
const FINISHED_STATS_TTL = 86400000; // for finished matches, statistics caches only available for 24 minutes


getFixtureInfo();

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

	let fixtureLineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);
	if (fixtureLineupCache) {
		fixtureLineupsAvailable = true;
		displayTeamCoaches(fixtureLineupCache, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
		console.log("Using cached information for lineup");
	} else {
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
		if (fixtureLineupsAvailable) {
			if (fixture.fixture.status.short === "FT") {
				setCacheInformationWithExpiry(
					`${fixtureID}-lineup`,
					fixtureLineup,
					FINISHED_LINEUP_TTL
				);
			} else {
				setCacheInformationWithExpiry(
					`${fixtureID}-lineup`,
					fixtureLineup,
					ONGOING_LINEUP_TTL
				);
			}

			console.log("No cached information for lineups found, caching now");
		}
		displayTeamCoaches(fixtureLineup, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
	}

	let fixtureStatisticsCache = getCacheInformationWithExpiry(
		`${fixtureID}-stats`
	);
	if (fixtureStatisticsCache) {
		fixtureStatisticsAvailable = true;
		displayStatisticsStatus(fixtureStatisticsCache, matchStatisticsContainer);
		console.log("Using cached information for statistics");
	} else {
		// Fetch statistics data from backend
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

		// cache statistics in localStorage
		if (fixtureStatisticsAvailable) {
			if (fixture.fixture.status.short === "FT") {
				setCacheInformationWithExpiry(
					`${fixtureID}-stats`,
					fixtureStatistics,
					FINISHED_STATS_TTL
				);
			} else {
				setCacheInformationWithExpiry(
					`${fixtureID}-stats`,
					fixtureStatistics,
					ONGOING_STATS_TTL
				);
			}

			console.log("No cached information for statistics found, caching now");
		}

		displayStatisticsStatus(fixtureStatistics, matchStatisticsContainer);
	}

	displayFixtureTitle(leagueInfo, teamsInfo, fixtureLeague, leagueHomepageLink, matchInfoTitle, leagueNameShort, leagueSeason);
	displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);
	getevents(fixtureID);
}

function getevents (ID) {
	const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3929d7ffd1mshebbaec9f369e0efp1f8b5bjsn5b5ffa6ed367',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures/events?fixture=${ID}`, options)
	.then(response => response.json())
	.then(response => 
		{ 
			const eventsarray= response.response; 
			console.log (eventsarray);
			for (let event of eventsarray) {
				const type = event.type;
				const time = event.time.elapsed;
				const team = event.team.id;
				const name = event.team.name;
				const logo = event.team.logo;
				const pid = event.player.id;
				const player = event.player.name;
				const detail = event.detail;
				const comments = event.comments;
				const assist = event.assist;
				console.log(type);
				console.log(time);
				console.log(team);
				console.log(name);
				console.log(logo);
				console.log(pid);
				console.log(player);
				console.log(detail);
				console.log(comments);
				console.log(assist);

			} }
	 ) 
	.catch(err => console.error(err));
}