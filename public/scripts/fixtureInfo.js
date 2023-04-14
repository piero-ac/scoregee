// Import necessary modules
import { fetchLeagueInfo, fetchFixtureAndTeamsInfo, fetchFixtureLineup, fetchFixtureStatistics } from "./fetchingData.js";
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

const ONGOING_LINEUP_TTL = 900000; // for ongoing matches, lineup caches only available for 15 minutes
const ONGOING_STATS_TTL = 180000; // for ongoing matches, statistics caches only available for 3 minute
const FINISHED_LINEUP_TTL = 86400000; // for finished matches, lineup caches only available for 24 hours
const FINISHED_STATS_TTL = 86400000; // for finished matches, statistics caches only available for 24 hours


// Initial Loading of Data for Page
getFixtureInfo();

async function getFixtureInfo() {
	try {
		// Fetch fixture data
		const leagueInfo = await fetchLeagueInfo(leagueNameShort, leagueSeason);
		const { fixture, teamsInfo } = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
		let lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`); 
		let statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`); 


		// Cache data if not already cached
		if (!lineupCache) {
			const fixtureLineup = await fetchFixtureLineup(leagueNameShort, leagueSeason, fixtureID);
			setCacheInformationWithExpiry(
			  `${fixtureID}-lineup`,
			  fixtureLineup,
			  fixture.fixture.status.short === "FT" ? FINISHED_LINEUP_TTL : ONGOING_LINEUP_TTL
			);
			lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);
		}

		if (!statsCache) {
			const fixtureStatistics = await fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID);
			setCacheInformationWithExpiry(
			  `${fixtureID}-stats`,
			  fixtureStatistics,
			  fixture.fixture.status.short === "FT" ? constants.FINISHED_STATS_TTL : constants.ONGOING_STATS_TTL
			);
			statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`);
		}

		// Display data
		displayTeamCoaches(lineupCache,  matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
		displayStatisticsStatus(statsCache, matchStatisticsContainer);
		displayFixtureTitle(leagueInfo, teamsInfo, fixtureLeague, leagueHomepageLink, matchInfoTitle, leagueNameShort, leagueSeason);
		displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);

	} catch (error){
		console.error(`An error occurred while fetching and displaying data: ${error}`);
	}
}