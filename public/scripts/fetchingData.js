export async function fetchLeagueInfo(leagueNameShort, leagueSeason){
	const leagueInfo = await fetch(`/football/${leagueNameShort}/${leagueSeason}/overview`)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league information: ${error}`);
		});

	return leagueInfo;
}

export async function fetchFixtureAndTeamsInfo(leagueNameShort, leagueSeason, fixtureID){
	const { fixture, teamsInfo } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league fixture and teams info: ${error}`);
		});

	return { fixture, teamsInfo };
}

export async function fetchFixtureLineup(leagueNameShort, leagueSeason, fixtureID){
	const { lineup: fixtureLineup } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/lineup`)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league information: ${error}`);
		});
	
	return fixtureLineup;
}

export async function fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID){
	const { statistics: fixtureStatistics } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league information: ${error}`);
		});
	return fixtureStatistics;
}

export async function fetchFixtureEvents(leagueNameShort, leagueSeason, fixtureID){
	const { events: fixtureEvents } = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/events`)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error(`Could not get league information: ${error}`);
		});
	return fixtureEvents;
}
