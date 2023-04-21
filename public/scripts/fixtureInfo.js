// Import necessary modules
import { fetchLeagueInfo, fetchFixtureAndTeamsInfo, fetchFixtureLineup, fetchFixtureStatistics, fetchFixtureEvents } from "./fetchingData.js";
import { displayTeamCoaches, displayStatisticsStatus, displayFixtureTitle, displayFixtureInfo, displayFixtureEvents } from "./displayFixture.js";
import { setCacheInformationWithExpiry, getCacheInformationWithExpiry } from "./caching.js";

const matchInfoTitle = document.querySelector("#match-info-title");
const fixtureLeague = document.querySelector("#fixture-league");
const fixtureMatchInfoDiv = document.querySelector(".fixture-match-info-div");
const matchInfoSection = document.querySelector("#match-info-sct");
const matchLineupContainer = document.querySelector("#match-lineup");
const matchStatisticsContainer = document.querySelector("#match-statistics");
const matchEventsContainer = document.querySelector("#match-events");
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

const TTLs = {
	ONGOING_FIXTURE_TTL : 180000, // for ongoing matches, update fixture info every 3 minutes
	ONGOING_LINEUP_TTL : 900000,  // for ongoing matches, lineup caches only available for 15 minutes
	ONGOING_STATS_TTL : 180000, // for ongoing matches, statistics caches only available for 3 minute
	FINISHED_TTL : 86400000 // for finished matches, lineup and stats valid for 24 hours
}
const inPlayStatusCodes = ["1H", "HT", "2H", "ET", "BT", "P", "INT"];
let previousMatchStatus = undefined;
let statisticsIntervalID = undefined;
let lineupsIntervalID = undefined;
let eventsIntervalID = undefined; 
let infoIntervalID = undefined;
let matchStatusIntervalID = undefined;

// Initial Loading of Data for Page
getFixtureInfo();

async function getFixtureInfo() {
	try {
		// Fetch fixture data
		const leagueInfo = await fetchLeagueInfo(leagueNameShort, leagueSeason);
		const { fixture, teamsInfo } = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
		let lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`); 
		let statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`); 
		let eventsCache = getCacheInformationWithExpiry(`${fixtureID}-events`);


		// Cache data if not already cached
		if (!lineupCache) {
			const fixtureLineup = await fetchFixtureLineup(leagueNameShort, leagueSeason, fixtureID);
			if(fixtureLineup.length !== 0) {
				setCacheInformationWithExpiry(
					`${fixtureID}-lineup`,
					fixtureLineup,
					fixture.fixture.status.short === "FT" ? TTLs.FINISHED_TTL : TTLs.ONGOING_LINEUP_TTL
				);
				lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);
			}
		}

		if (!statsCache) {
			const fixtureStatistics = await fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID);
			if(fixtureStatistics.length !== 0){
				setCacheInformationWithExpiry(
					`${fixtureID}-stats`,
					fixtureStatistics,
					fixture.fixture.status.short === "FT" ? TTLs.FINISHED_TTL : TTLs.ONGOING_STATS_TTL
				);
				statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`);
			}	
		}

		if(!eventsCache){
			const fixtureEvents = await fetchFixtureEvents(leagueNameShort, leagueSeason, fixtureID);
			if(fixtureEvents.length !== 0){
				setCacheInformationWithExpiry(
					`${fixtureID}-events`,
					fixtureEvents,
					fixture.fixture.status.short === "FT" ? TTLs.FINISHED_TTL : TTLs.ONGOING_FIXTURE_TTL
				);
				eventsCache = getCacheInformationWithExpiry(`${fixtureID}-events`);	
			}
		}

		// Display data
		displayTeamCoaches(lineupCache,  matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
		displayStatisticsStatus(statsCache, matchStatisticsContainer);
		displayFixtureTitle(leagueInfo, teamsInfo, fixtureLeague, leagueHomepageLink, matchInfoTitle, leagueNameShort, leagueSeason);
		displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);
		displayFixtureEvents(eventsCache, matchEventsContainer);

		// Start Interval To Monitor Match Status Every Minute
		matchStatusIntervalID = setInterval(async() => {
			const { fixture }  = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
			const currentStatus = fixture.fixture.status.short;
			
			// on page load, previousMatchStatus will be undefined, then check what current status of fixture is
			if(previousMatchStatus === undefined) {
				console.log("Page has been refreshed, or initial page load")
				// can only check current status of match
				// check if current status is an inPlay status code
				if(inPlayStatusCodes.includes(currentStatus)){
					setSchedulingForOngoingMatch();
					// check if the current status is FT or NS (match is over or hasn't started)
				}  else if (currentStatus === "FT" || currentStatus === "NS"){
					// call all scheduling tasks to run for there corresponding intervals for a finished match
					setSchedulingForFinishedMatch();
				}
				previousMatchStatus = currentStatus;
			} else if (previousMatchStatus !== currentStatus) { // compare most recent status with previous match status
				// If the previous match status was previously NS & currentStatus is an inPlay status code (so match went from not started to inplay)
				if (previousMatchStatus === "NS" && inPlayStatusCodes.includes(currentStatus)){
					console.log("Match has gone from NS to In Play. Changing Interval Times for Updating Data to ONGOING times");
					//then kill all timeouts as they will have a 24 hour interval
					stopUpdating();
					// call all scheduling tasks to run for there corresponding intervals for an ongoing match
					setSchedulingForOngoingMatch();
					previousMatchStatus = currentStatus;

				// If previous match status is an inPlay status code and current status is FT (so match went from inplay to finished)
				} else if (inPlayStatusCodes.includes(previousMatchStatus) && currentStatus === "FT"){
					console.log("Match has gone from In Play to FT. Changing Interval Times for Updating Data to FINISHED times");
					// then kill all timeoutes as they will have intervals for an ongoing match
					stopUpdating();
					// call all scheduling tasks to run for there corresponding intervals for a finished match
					setSchedulingForFinishedMatch();
					previousMatchStatus = currentStatus;

				// If previous match status is FT (match is already over)
				} else if (previousMatchStatus === "FT") {
					console.log("Match is over. Killing all update functions")
					stopUpdating(true);
				}

			} else if (previousMatchStatus === currentStatus && previousMatchStatus === "FT") {
				console.log("Match is over. Killing all update functions")
				stopUpdating(true);

			} else if (previousMatchStatus === currentStatus){
				console.log("Match Status Hasn't Changed");
			}
		}, 60000);


	} catch (error){
		console.error(`An error occurred while fetching and displaying data: ${error}`);
	}
}

function scheduleStatisticsUpdate(interval){
	console.log(`Scheduling statistics update for every ${interval}`);
	
	return setInterval(async () => {
		console.log("Displaying updated statistics information");
		const response = await fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID);
		if(response.length !== 0){
			// Update the statistics information on the website
			displayStatisticsStatus(response, matchStatisticsContainer);
			// Update the cache data for statistics
			setCacheInformationWithExpiry(`${fixtureID}-stats`, response, interval);
			statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`);
		}
	}, interval);
}

function scheduleLineupsUpdate(interval) {
	console.log(`Scheduling lineup update for every ${interval}`);
	
	return setInterval(async () => {
		console.log("Displaying updated lineup information");
	  	const response = await fetchFixtureLineup(leagueNameShort, leagueSeason, fixtureID);
		if(response.length !== 0){
			// Update the lineup information on the website
			displayTeamCoaches(response, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
			// Update the cache data for lineup
			setCacheInformationWithExpiry(`${fixtureID}-lineup`, response, interval);
			lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);
		}
	}, interval);
  }

function scheduleFixtureInfoUpdate(interval){
	console.log(`Scheduling fixture info update for every ${interval}`);
  
	return setInterval(async () => {
		console.log("Displaying updated fixture information");
		const { teamsInfo, fixture } = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
		displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);
	}, interval);
}

function scheduleFixtureEventsUpdate(interval){
	console.log(`Scheduling fixture events update for every ${interval}`);
	return setInterval(async() => {
		console.log("Displaying updated fixture events information");
		const response = await fetchFixtureEvents(leagueNameShort, leagueSeason, fixtureID);
		if(response.length !== 0){
			displayFixtureEvents(response, matchEventsContainer);
			setCacheInformationWithExpiry(`${fixtureID}-events`, response, interval);
			eventsCache = getCacheInformationWithExpiry(`${fixtureID}-events`);	
		}
	}, interval);
}

function stopUpdating(stopCheckingMatchStatus = false) {
	clearInterval(statisticsIntervalID);
	clearInterval(lineupsIntervalID);
	clearInterval(infoIntervalID);
	clearInterval(eventsIntervalID);
	if(stopCheckingMatchStatus) clearInterval(matchStatusIntervalID);
}

function setSchedulingForFinishedMatch(){
	statisticsIntervalID = scheduleStatisticsUpdate(TTLs.FINISHED_TTL);
	lineupsIntervalID = scheduleLineupsUpdate(TTLs.FINISHED_TTL);
	infoIntervalID = scheduleFixtureInfoUpdate(TTLs.FINISHED_TTL);
	eventsIntervalID =  scheduleFixtureEventsUpdate(TTLs.FINISHED_TTL);
}

function setSchedulingForOngoingMatch(){
	statisticsIntervalID = scheduleStatisticsUpdate(TTLs.ONGOING_STATS_TTL);
	lineupsIntervalID = scheduleLineupsUpdate(TTLs.ONGOING_LINEUP_TTL);
	infoIntervalID = scheduleFixtureInfoUpdate(TTLs.ONGOING_FIXTURE_TTL);
	eventsIntervalID =  scheduleFixtureEventsUpdate(TTLs.ONGOING_FIXTURE_TTL);
}