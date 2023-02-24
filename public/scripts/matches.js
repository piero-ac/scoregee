const matchesHeading = document.querySelector("#matches-hd");
const matchesContainer = document.querySelector("#matches-ctn");
const pageTitle = document.querySelector("title");
const url = window.location.href;
const urlParts = url.split('/');
const date = urlParts[urlParts.length - 1];
const leagueNameShort = urlParts[urlParts.length - 3];

// Fetch the matches for the specified date
fetch(`http://localhost:3000/football/${leagueNameShort}/fixtures/${date}/data`)
.then((response) => {
    return response.json();
})
.then((data) => {
    displayMatches(data);
})
.catch((error) => {
    console.log(error);
});

function displayMatches(data){
    const { fixtures, league, date } = data;
    pageTitle.innerText = `Matches for ${date}`;

    for(let match of fixtures){
        const { fixture, league: leagueInfo, teams, goals, score } = match;
        const { id: fixtureID, referee, timezone, date: dateLong, time, timestamp,
                periods: { first: firstPeriod, second: secondPeriod }, 
                venue : { id: venueID, name: venueName, city: venueCity}, 
                status: { long: statusLong, short: statusShort, elapsed}} = fixture;
        // const { id: leagueID, name: leagueName, country, logo, flag, season, round } = leagueInfo; 
        const { home : { id: homeID, name: homeName, logo: homeLogo, winner: homeIsWinner}, 
                away: { id: awayID, name: awayName, logo: awayLogo, winner: awayIsWinner} } = teams;
        const { home: homeGoals, away: awayGoals} = goals; 
        const { halftime: { home: homeGoalsHT, away: awayGoalsHT },
                fulltime: { home: homeGoalsFT, away: awayGoalsFT },
                extratime: { home: homeGoalsET, away: awayGoalsET },
                penalty: { home: homeGoalsPT, away: awayGoalsPT } } = score;

        const matchInfoContainer = document.createElement('div');

        const matchInfoHeading = document.createElement('h2');
        matchInfoHeading.innerText = `Home: ${homeName} vs Away: ${awayName}`;

        const homeImg = document.createElement('img');
        homeImg.setAttribute('src', homeLogo);
        homeImg.setAttribute('alt', homeName);

        const awayImg = document.createElement('img');
        awayImg.setAttribute('src', awayLogo);
        awayImg.setAttribute('alt', awayName);

        const stadiumInfo = document.createElement('h3');
        stadiumInfo.innerText = `Stadium: ${venueName}`;

        const cityInfo = document.createElement('h3');
        cityInfo.innerText = `City: ${venueCity}`;

        const matchStatus = document.createElement('p');
        matchStatus.innerText = `Match Status: ${statusLong}`;

        const matchScore = document.createElement('p');
        if(statusLong === "Not Started" || statusLong === "Match Postponed" || statusLong === "Time to be defined"){
            matchScore.innerText += "Score: TBA";
        } else if (statusLong === "First Half" || statusLong === "Second Half" || statusLong === "Halftime") {
            matchScore.innerText += `Score: ${homeGoalsHT} vs ${awayGoalsHT}`;
        } else {
            matchScore.innerText += `Score: ${homeGoalsFT} vs ${awayGoalsFT}`;
        }

        matchInfoContainer.append(matchInfoHeading, homeImg, awayImg, stadiumInfo, cityInfo, matchStatus, matchScore);
        matchesContainer.append(matchInfoContainer);

    }
    

}
