const fixtureLeague = document.querySelector("#fixture-league");
const fixtureMatchInfoDiv = document.querySelector("#fixture-match-info-div");
const matchInfoSection = document.querySelector("#match-info-sct");
const quickInfoDiv = document.querySelector("#quick-info");
const quickInfoData = document.querySelector("#quick-info-data");

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
	.then((data) => displayFixtureInfo(data));

function parseData(data) {
	const { leagueInfo, teamsInfo, fixture, lineup } = data;
	const { leagueName, leagueCountry } = leagueInfo;
	fixtureLeague.innerText = `${leagueName} - ${leagueCountry}`;

	return { teamsInfo, fixture, lineup };
}

function displayFixtureInfo(data) {
	const { teamsInfo, fixture, lineup } = data;
	console.log(fixture);
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
