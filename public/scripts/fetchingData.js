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

	try {
		const response = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/lineup`);
		
		if(response.status === 200) {
			const { lineup: fixtureLineup } = await response.json();
			return fixtureLineup;
		} else if (response.status === 204) {
			console.log("No data returned by API.");
			return [];
		} else if (response.status === 499 || response.status === 500) {
			const { error: errorMessage } = response.json();
			console.log(`API Returned Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		} else {
			// unexpected error code returned
			const { error: errorMessage, actualStatusCode: statusCode} = response.json();
			console.log(`API Returned Unexpected Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		}
	} catch (error) {
		console.error(`Error during fetch: ${error.message}`)
		return [];
	}
}

export async function fetchFixtureStatistics(leagueNameShort, leagueSeason, fixtureID){

	try {
		const response = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/statistics`);

		if(response.status === 200) {
			const { statistics: fixtureStatistics } = await response.json();
			return fixtureStatistics;
		} else if (response.status === 204) {
			console.log("No data returned by API.");
			return [];
		} else if (response.status === 499 || response.status === 500) {
			const { error: errorMessage } = response.json();
			console.log(`API Returned Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		} else {
			// unexpected error code returned
			const { error: errorMessage, actualStatusCode: statusCode} = response.json();
			console.log(`API Returned Unexpected Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		}
	} catch (error) {
		console.error(`Error during fetch: ${error.message}`)
		return [];
	}
}

export async function fetchFixtureEvents(leagueNameShort, leagueSeason, fixtureID){

	try {
		const response = await fetch(`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/events`);

		if(response.status === 200){
			const { events: fixtureEvents } = await response.json();
			return fixtureEvents;
		} else if (response.status === 204) {
			console.log("No data returned by API.");
			return [];
		} else if (response.status === 499 || response.status === 500) {
			const { error: errorMessage } = response.json();
			console.log(`API Returned Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		} else {
			// unexpected error code returned
			const { error: errorMessage, actualStatusCode: statusCode} = response.json();
			console.log(`API Returned Unexpected Status Code: ${statusCode} with message: ${errorMessage}`);
			return [];
		}
	} catch (error) {
		console.error(`Error during fetch: ${error.message}`)
		return [];
	}
}
