// Creates a container for a team's ranking information
function createTeamStandingsContainer(teamInfo){
	const { teamID, teamPoints, teamRanking } = teamInfo.team;
	const teamStandingPara = document.createElement("p");
	teamStandingPara.innerText = `${teamRanking}. ${teamInfo.teamName} (${teamInfo.teamCode}) - ${teamPoints}`;
	return teamStandingPara;
}

// Returns a standings array containing the team name, their rankings, and points
export function mapTeamsForLeagueStandings(standings, teamsInfo){
	const leagueStandings = []; 
	for (let team of standings.leagueStandings) {
		// find the team name based on the teamID that matches
		const { teamName, teamCode } = teamsInfo.find((obj) => team.teamID == obj.teamID);
		leagueStandings.push({teamName, teamCode, team});
	}
	return leagueStandings;
}


// Displays the rankings for the league
export function displayLeagueStandings(leagueStandings, standingsContainer) {
	for(let team of leagueStandings){
		const teamStandingPara = createTeamStandingsContainer(team);
		standingsContainer.appendChild(teamStandingPara);
	}
}