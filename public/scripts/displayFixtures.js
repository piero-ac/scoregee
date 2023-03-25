import { getLocalTime} from "./formatTime.js"

export function displayLeagueFixtures(fixtureMDSearchBtnsDiv, fixtures, leagueName, leagueSeason){
    const matchdates = getFixtureMatchdates(fixtures);

    for(let md of matchdates){
        const searchMDFixtureButton = createSearchFixturesButton(leagueName, leagueSeason, md);
        fixtureMDSearchBtnsDiv.append(searchMDFixtureButton);
    }

}

export function linkFixturesToMDButtons(mdButtons, fixtureDisplayDateHeading, fixturesForDateDiv, leagueFixtures, leagueTeamsInfo){
    for(let btn of mdButtons){
        const btnText =  btn.textContent;
        const btnValue = btn.value;
        btn.addEventListener("click", function() {
            fixtureDisplayDateHeading.textContent = "";
            fixturesForDateDiv.textContent = "";
            displayMatchdateFixtures(
                fixtureDisplayDateHeading,
                fixturesForDateDiv,
                leagueFixtures,
                leagueTeamsInfo,
                btnValue, btnText
            );
        })

    }

}

function getFixtureMatchdates(fixtures){
    const matchdates = new Set();
    for(let f of fixtures){
        matchdates.add(f.league.leagueRound);
    }
    return matchdates;
}

function createSearchFixturesButton(leagueName, leagueSeason, md){
    const mdURL = md.split(" ").join("");

    const searchFixturesButton = document.createElement("button");
    searchFixturesButton.classList.add("mdButton");
    searchFixturesButton.innerText = md;
    searchFixturesButton.value = `${leagueName}/${leagueSeason}/${mdURL}`;

    return searchFixturesButton;
}

function displayMatchdateFixtures(fixtureDisplayDateHeading,
    fixturesForDateDiv,
    leagueFixtures,
    leagueTeamsInfo,
    btnValue, btnText) {
    // Set the heading for the fixture date
    fixtureDisplayDateHeading.innerText = btnText;

    // Get the abbreviate league name and season from btnValue
    const leagueNameShort = btnValue.split("/")[0];
    const leagueSeason = btnValue.split("/")[1];

    // Get the matchdate from btnValue
    const matchdate = `Regular Season - ${btnValue.substring(btnValue.indexOf("-") + 1)}`;
    
    // Get the fixtures for the matchdate selected
	const fixtures = leagueFixtures.filter((obj) => obj.league.leagueRound === matchdate);
    
    if (fixtures.length !== 0) {
		// go through each fixture and create a div containing its information
		for (let f of fixtures) {
			// console.log(f);
			const fixtureMatchInfoDiv = createFixtureInfoContainer(f, leagueTeamsInfo, leagueNameShort, leagueSeason);
			// append div with fixture information to parent div
			fixturesForDateDiv.appendChild(fixtureMatchInfoDiv);
		}
	}
}

function createFixtureInfoContainer(fixtureObj, leagueTeamsInfo, leagueNameShort, leagueSeason){
    const { fixture, teams, goals, score } = fixtureObj;
	const { home: homeTeamInfo, away: awayTeamInfo } = teams;

    // Create the parent div containing the fixture's information
    const fixtureMatchInfoDiv = document.createElement("div");
	fixtureMatchInfoDiv.classList.add("fixture-match-info-div");

    // Create the child divs containing the team's information
    const homeTeamInfoDiv = createTeamInfoDiv(homeTeamInfo, "home", leagueTeamsInfo);
	const awayTeamInfoDiv = createTeamInfoDiv(awayTeamInfo, "away", leagueTeamsInfo);

    // Create the div containing the fixture's details on score, status, etc.
    const matchInfoDiv = createMatchInfoDiv(fixture, goals, score, true, leagueNameShort, leagueSeason);

    // Append the teams and match information divs to parent div
    fixtureMatchInfoDiv.append(homeTeamInfoDiv, matchInfoDiv, awayTeamInfoDiv)

    return fixtureMatchInfoDiv;
}


// Creates the container for the team information such as logo and name
function createTeamInfoDiv(team, type, teamInfoObj) {
	// console.log("Starting createTeamInfoDiv");

	const teamInfo = teamInfoObj.find((obj) => obj.teamID === team.teamID);

	const teamInfoDiv = document.createElement("div");
	if (type === "home") {
		teamInfoDiv.classList.add("homeTeam", "team");
	} else {
		teamInfoDiv.classList.add("awayTeam", "team");
	}

	const teamLogoImg = document.createElement("img");
	teamLogoImg.setAttribute("src", teamInfo.teamLogo);
	teamLogoImg.setAttribute("alt", `Logo for ${teamInfo.teamName}`);

	const teamNamePara = document.createElement("p");
	teamNamePara.innerText = teamInfo.teamName;

	teamInfoDiv.append(teamLogoImg, teamNamePara);
	// console.log("Ending createTeamInfoDiv");
	return teamInfoDiv;
}

function createMatchInfoDiv(fixture, goals, score, addfixtureLink = false, leagueNameShort, leagueSeason) {
	// console.log("Starting createMatchInfoDiv");
	const matchStatusLong = fixture.status.long;
	const matchStatusShort = fixture.status.short;
	const fixtureid = fixture.id;
	const dateLong = fixture.date;

	const matchInfoDiv = document.createElement("div");
	matchInfoDiv.classList.add("match-info");

	const datePara = document.createElement("p");
	const dateShort = dateLong.substring(0, dateLong.indexOf("T"));
	datePara.innerText = dateShort;

	const timePara = document.createElement("p");
	const time = getLocalTime(dateLong);
	timePara.innerText = time;

	const statusPara = document.createElement("p");
	if (matchStatusShort === "FT") {
		statusPara.innerText = `FT - ${score.fulltime.home} : ${score.fulltime.away}`;
	} else if (matchStatusShort === "HT") {
		statusPara.innerText = `HT - ${score.halftime.home} : ${score.halftime.away}`;
	} else if (matchStatusShort === "CANC") {
		statusPara.innerText = `Canceled`;
	} else if (matchStatusShort === "PST") {
		statusPara.innerText = `Postponed`;
	} else if (matchStatusShort === "NS") {
		statusPara.innerText = "Not Started";
	}

	if (addfixtureLink === true) {
		const fixtureLink = document.createElement("a");
		fixtureLink.setAttribute(
			"href",
			`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureid}`
		);
		fixtureLink.innerText = "More Info";
		const fixturePara = document.createElement("p");
		fixturePara.append(fixtureLink);

		matchInfoDiv.append(datePara, timePara, statusPara, fixtureLink);
	} else {
		matchInfoDiv.append(datePara, timePara, statusPara);
	}

	// console.log("Ending createMatchInfoDiv");
	return matchInfoDiv;
}
