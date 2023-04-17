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
			  fixture.fixture.status.short === "FT" ? TTLs.FINISHED_TTL : TTLs.ONGOING_LINEUP_TTL
			);
			lineupCache = getCacheInformationWithExpiry(`${fixtureID}-lineup`);
		}

		if (!statsCache) {
			const fixtureStatistics = await fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID);
			setCacheInformationWithExpiry(
			  `${fixtureID}-stats`,
			  fixtureStatistics,
			  fixture.fixture.status.short === "FT" ? TTLs.FINISHED_TTL : TTLs.ONGOING_STATS_TTL
			);
			statsCache = getCacheInformationWithExpiry(`${fixtureID}-stats`);
		}

		// Display data
		displayTeamCoaches(lineupCache,  matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
		displayStatisticsStatus(statsCache, matchStatisticsContainer);
		displayFixtureTitle(leagueInfo, teamsInfo, fixtureLeague, leagueHomepageLink, matchInfoTitle, leagueNameShort, leagueSeason);
		displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);

		// Schedule the statistics update
		scheduleStatisticsUpdate(fixture, TTLs);
		// Schedule the lineups update
		scheduleLineupsUpdate(fixture, TTLs);
		// Schedule the fixture info update
		scheduleFixtureInfoUpdate(fixture, TTLs);

	} catch (error){
		console.error(`An error occurred while fetching and displaying data: ${error}`);
	}
}

function scheduleStatisticsUpdate(fixture, TTLs){
	const matchStatus = fixture.fixture.status.short;
	let statsUpdateInterval = inPlayStatusCodes.includes(matchStatus) ? TTLs.ONGOING_STATS_TTL : TTLs.FINISHED_TTL;

	console.log(`Scheduling statistics update for every ${statsUpdateInterval}`);

	setTimeout(async () => {
		const updatedFixture = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
		const updatedStats = await fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID);
		displayStatisticsStatus(updatedStats, matchStatisticsContainer);
		scheduleStatisticsUpdate(updatedFixture.fixture, TTLs);
		console.log(`Fetching statistics data`);
	}, statsUpdateInterval);
}

function scheduleLineupsUpdate(fixture, TTLs) {
	const matchStatus = fixture.fixture.status.short;
	let lineupUpdateInterval = (inPlayStatusCodes.includes(matchStatus)) ? TTLs.ONGOING_LINEUP_TTL : TTLs.FINISHED_TTL;
	
	console.log(`Scheduling lineup update for every ${lineupUpdateInterval}`);
	
	setTimeout(async () => {
	  const updatedFixture = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
	  const updatedLineup = await fetchFixtureLineup(leagueNameShort, leagueSeason, fixtureID);
	  displayTeamCoaches(updatedLineup, matchLineupContainer, lineupCoachContainers, lineupPlayerContainers);
	  scheduleLineupUpdate(updatedFixture.fixture, TTLs);
	  console.log(`Fetching lineup data`);
	}, lineupUpdateInterval);
  }

function scheduleFixtureInfoUpdate(fixture, TTLs){
	const matchStatus = fixture.fixture.status.short;
	let fixtureInfoUpdateInterval = inPlayStatusCodes.includes(matchStatus) ? TTLs.ONGOING_FIXTURE_TTL : TTLs.FINISHED_TTL; 

	console.log(`Scheduling fixture info update for every ${fixtureInfoUpdateInterval}`);
  
	setTimeout(async () => {
		const { teamsInfo, fixture } = await fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID);
		displayFixtureInfo({ teamsInfo, fixture }, quickInfoData, fixtureMatchInfoDiv);
		console.log(`Fetching fixture data`);
	}, fixtureInfoUpdateInterval);
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
				const ai = event.assist.id;
				const an = event.assist.name;
				console.log(type);
				console.log(time);
				console.log(team);
				console.log(name);
				console.log(logo);
				console.log(pid);
				console.log(player);
				console.log(detail);
				console.log(comments);
				console.log(ai);
				console.log(an);
				let output = " ";
				output += `${time}' `;
				output += `${player} `;
				if (type === "Card") {
					output += `${detail} `;
				}
				else if (type === "subst") {
					output += 'Substitution ' ;
				}
				else if (type === "Goal") {
					output += 'Goal' ;
				}

				const Eventparagraph = document.createElement("p");
				Eventparagraph.textContent = output;
				matchEventsContainer.append(Eventparagraph); 

			}
			 }
	 ) 
	.catch(err => console.error(err));
}