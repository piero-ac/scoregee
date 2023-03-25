// Returns a standings array containing the team name, their rankings, and points
function mapTeamsForLeagueStandings(standings, teamsInfo){
	const leagueStandings = []; 
	for (let team of standings.leagueStandings) {
		// find the team name based on the teamID that matches
		const { teamName, teamCode } = teamsInfo.find((obj) => team.teamID == obj.teamID);
		leagueStandings.push({teamName, teamCode, team});
	}
	return leagueStandings;
}

// Creates the buttons that query the fixtures for the matchdate
function displayFixtureDates(
	fixtureDatesDiv,
	fixtures,
	teamsInfo,
	leagueName,
	leagueSeason,
	fixtureMatchdateHeading,
	fixtureMatchdateCont
) {
	const matchdates = new Set();
	for (let f of fixtures) {
		matchdates.add(f.league.leagueRound);
	}

	// create a button for each matchdate to display fixtures for that date
	for (let md of matchdates) {
		const mdURL = md.split(" ").join("");
		const button = document.createElement("button");
		button.classList.add("mdButton");
		button.innerText = md;
		button.value = `${leagueName}/${leagueSeason}/${mdURL}`;

		// add event listener to display button value
		button.addEventListener("click", function () {
			fixturesForDateDiv.textContent = "";
			displayMatchdateFixtures(
				fixtureMatchdateHeading,
				fixtureMatchdateCont,
				fixtures,
				teamsInfo,
				this.value,
				this.innerText
			);
		});
		fixtureDatesDiv.append(button);
	}
}

function displayMatchdateFixtures(
	fixtureMatchdateHeading,
	fixtureMatchdateCont,
	fixturesObj,
	teamsInfo,
	btnValue,
	btnText
) {
	// Set the heading for the fixture date
	fixtureMatchdateHeading.innerText = btnText;

	// Get the matchdate from btnValue
	const matchdate = `Regular Season - ${btnValue.substring(
		btnValue.indexOf("-") + 1
	)}`;
	// Get the fixtures for the matchdate selected
	const fixtures = fixturesObj.filter(
		(obj) => obj.league.leagueRound === matchdate
	);

	if (fixtures.length !== 0) {
		// go through each fixture and create a div containing its information
		for (let f of fixtures) {
			// console.log(f);
			const fixtureMatchInfoDiv = createFixtureContainer(f, teamsInfo);
			// append div with fixture information to parent div
			fixtureMatchdateCont.appendChild(fixtureMatchInfoDiv);
		}
	}
}
