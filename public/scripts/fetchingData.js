export async function fetchLeagueInfo(){
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

export async function fetchFixtureAndTeamsInfo(){
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

export async function fetchFixtureLineup(){
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

export async function fetchFixtureStatistics(){
	const { statistics: fixtureStatistics } = await fetch(`/football/{leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`)
		.then((response) => {
			fixtureStatisticsAvailable = true;
			return response.json();
		})
		.catch((error) => {
			fixtureStatisticsAvailable = false;
			console.error(`Could not get league information: ${error}`);
			return [];
		});
	return fixtureStatistics;
}
