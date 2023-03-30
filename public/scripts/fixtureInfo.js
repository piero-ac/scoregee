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
const ONGOING_STATS_TTL = 180000; // for ongoing matches, statistics caches only available for 3 minute
const FINISHED_LINEUP_TTL = 86400000; // for finished matches, lineup caches only available for 24 hours
const FINISHED_STATS_TTL = 86400000; // for finished matches, statistics caches only available for 24 minutes


getFixtureInfo();

async function getFixtureInfo() {
	// Fetch the league information
	const leagueInfo = await fetchLeagueInfo();

	// Fetch the Fixture Information and Teams Playing Information
	const { fixture, teamsInfo } = await fetchFixtureAndTeamsInfo();

	// Check if Cache Containing Fixture Lineup is available
	let fixtureLineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);

	if (fixtureLineupCache) {
		fixtureLineupsAvailable = true;
		// Display Team Coaches and Lineup Information using Cached Data
		displayTeamCoaches(fixtureLineupCache, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
		console.log("Using cached information for lineup");
	} else {
		// Otherwise, Fetch the Fixture Lineup
		const fixtureLineup = await fetchFixtureLineup();

		// If fixture lineup was obtained, then create a cache for it
		if (fixtureLineupsAvailable) {
			// If fixture is over, then set cache for lineup to last 24 hours
			if (fixture.fixture.status.short === "FT") {
				setCacheInformationWithExpiry(
					`${fixtureID}-lineup`,
					fixtureLineup,
					FINISHED_LINEUP_TTL
				);
			// If fixture is not over, then set cache for lineup to last 15 minutes
			} else {
				setCacheInformationWithExpiry(
					`${fixtureID}-lineup`,
					fixtureLineup,
					ONGOING_LINEUP_TTL
				);
			}

			console.log("No cached information for lineups found, caching now");
		}
		// Display Team Coaches and Lineup information using API data
		displayTeamCoaches(fixtureLineup, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
	}

	// Check if Cache Containing Fixture Statistics is available
	let fixtureStatisticsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`);
	if (fixtureStatisticsCache) {
		fixtureStatisticsAvailable = true;
		// Display Fixture Statistics using cached data
		displayStatisticsStatus(fixtureStatisticsCache, matchStatisticsContainer);
		console.log("Using cached information for statistics");
	} else {
		// Fetch statistics data from backend
		const fixtureStatistics = await fetchFixtureStatistics();

		// If fixture statistics was obtained, then create a cache for it
		if (fixtureStatisticsAvailable) {
			// If fixture is over, then set cache to last 24 hours
			if (fixture.fixture.status.short === "FT") {
				setCacheInformationWithExpiry(
					`${fixtureID}-stats`,
					fixtureStatistics,
					FINISHED_STATS_TTL
				);
			// If fixture is not over, then set cache to last 3 minutes
			} else {
				setCacheInformationWithExpiry(
					`${fixtureID}-stats`,
					fixtureStatistics,
					ONGOING_STATS_TTL
				);
			}

			console.log("No cached information for statistics found, caching now");
		}
		// Display Fixture Statistics using API Data
		displayStatisticsStatus(fixtureStatistics, matchStatisticsContainer);
	}

	// Display Fixture Title and Set Anchor Link To Go Back To Correct League Page
	displayFixtureTitle(leagueInfo, teamsInfo, fixtureLeague, leagueHomepageLink, matchInfoTitle, leagueNameShort, leagueSeason);

	// Display Fixture Information (Top of the page)
	displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);
}


async function fetchLeagueInfo(){
	const leagueInfo = await fetch(`/football/${leagueNameShort}/${leagueSeason}/overview`)
		.then((response) => {
			leagueInfoAvailable = true;
			return response.json();
		})
		.catch((error) => {
			leagueInfoAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});

	return leagueInfo;
}

async function fetchFixtureAndTeamsInfo(){
	const { fixture, teamsInfo } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`)
		.then((response) => {
			leagueFixtureAvailable = true;
			return response.json();
		})
		.catch((error) => {
			leagueFixtureAvailable = false;
			console.error(`Could not get league fixture and teams info: ${error}`);
		});

	return { fixture, teamsInfo };
}

async function fetchFixtureLineup(){
	const { lineup: fixtureLineup } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/lineup`)
		.then((response) => {
			fixtureLineupsAvailable = true;
			return response.json();
		})
		.catch((error) => {
			fixtureLineupsAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});
	
	return fixtureLineup;
}

async function fetchFixtureStatistics(){
	const { statistics: fixtureStatistics } = await fetch(`/football/{leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`)
		.then((response) => {
			fixtureStatisticsAvailable = true;
			return response.json();
		})
		.catch((error) => {
			fixtureStatisticsAvailable = false;
			console.error(`Could not get league information: ${error}`);
		});
	return fixtureStatistics;
}