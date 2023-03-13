const fixtureLeague = document.querySelector("#fixture-league");
const fixtureMatchInfoDiv = document.querySelector("#fixture-match-info-div");
const matchInfoSection = document.querySelector("#match-info-sct");
const quickInfoDiv = document.querySelector("#quick-info");
const quickInfoData = document.querySelector("#quick-info-data");
const leagueHomepageLink = document.querySelector("#league-hp-link");
const homeTeamCoach = document.querySelector("#homeTeam-coach");
const homeTeamStarters = document.querySelector("#homeTeam-starters");
const homeTeamSubs = document.querySelector("#homeTeam-subs");
const awayTeamCoach = document.querySelector("#awayTeam-coach");
const awayTeamStarters = document.querySelector("#awayTeam-starters");
const awayTeamSubs = document.querySelector("#awayTeam-subs");

const url = window.location.href;
const urlParts = url.split("/");
const leagueNameShort = urlParts[urlParts.length - 4];
const leagueSeason = urlParts[urlParts.length - 3];
const fixtureID = urlParts[urlParts.length - 1];

const fixtureInfoPromise = fetch(
	`/football/${leagueNameShort}/${leagueSeason}/fixture/${fixtureID}/info`
);

fixtureInfoPromise
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => parseData(data))
	.then((data) => displayFixtureInfo(data))
	.then((data) => displayTeamLineups(data))
	.catch((err) => console.log(err));

function parseData(data) {
	const { leagueInfo, teamsInfo, fixture, lineup } = data;
	const { leagueName, leagueCountry } = leagueInfo;
	fixtureLeague.innerText = `${leagueName} - ${leagueCountry}`;

	leagueHomepageLink.setAttribute(
		"href",
		`/football/${leagueNameShort}/${leagueSeason}`
	);

	return { teamsInfo, fixture, lineup };
}

// Displays the time, referee, and stadium of the fixture
function displayFixtureInfo(data) {
	const { teamsInfo, fixture, lineup } = data;
	// console.log(fixture);
	const {
		referee,
		date: dateLong,
		venue: { name: stadiumName },
	} = fixture.fixture;

	const time = dateLong.substring(
		dateLong.indexOf("T") + 1,
		dateLong.indexOf("T") + 6
	);

	const refereePara = document.createElement("p");
	refereePara.innerText = referee;

	const timePara = document.createElement("p");
	timePara.innerText = time;

	const stadiumPara = document.createElement("p");
	stadiumPara.innerText = stadiumName;

	quickInfoData.append(timePara, refereePara, stadiumPara);

	return { teamsInfo, lineup };
}

function displayTeamLineups(data) {
	const { teamsInfo, lineup } = data;
	const {
		coach: hCoach,
		formation: hFormation,
		team: { name: hName },
	} = lineup[0];

	const {
		coach: aCoach,
		formation: aFormation,
		team: { name: aName },
	} = lineup[1];

	// Display the lineup subheaders
	homeTeamCoach.innerText = `${hName.toUpperCase()} Coach: ${
		hCoach.name
	} Formation: ${hFormation}`;
	awayTeamCoach.innerText = `${aName.toUpperCase()} Coach: ${
		aCoach.name
	} Formation: ${aFormation}`;

	// Display home team starters
	displayPlayers("home", "starters", lineup[0].startXI);

	// Display away team starters
	displayPlayers("away", "starters", lineup[1].startXI);

	// Display home team subs
	displayPlayers("home", "substitutes", lineup[0].substitutes);

	// Display away team subs
	displayPlayers("away", "substitutes", lineup[1].substitutes);
}

function displayPlayers(team, type, players) {
	for (let player of players) {
		const { player: pInfo } = player; // save the player information
		const { name, number, pos, grid } = pInfo;

		// create a paragraph element to display information
		const playerP = document.createElement("p");
		playerP.innerText = `Number: ${number} Name: ${name} POS: ${pos}`;

		// Add player information to the correct section
		if (team === "home" && type === "starters") {
			homeTeamStarters.append(playerP);
		} else if (team === "away" && type === "starters") {
			awayTeamStarters.append(playerP);
		} else if (team === "home" && type === "substitutes") {
			homeTeamSubs.append(playerP);
		} else if (team === "away" && type === "substitutes") {
			awayTeamSubs.append(playerP);
		}
	}
}
