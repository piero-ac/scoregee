// const eplData = require('./match-data/en1.json');
// const laligaData = require('./match-data/es1.json');
// const ligue1Data = require('./match-data/fr1.json');
// const bundesligaData = require('./match-data/de1.json');
// const serieaData = require('./match-data/it1.json');

// // tests 
// const eplMatchDates = findDates(eplData);
// console.log('EPL', eplMatchDates);

// const laligaMatchDates = findDates(laligaData);
// console.log('La Liga', laligaMatchDates);

// const ligue1MatchDates = findDates(ligue1Data);
// console.log('Ligue 1', ligue1MatchDates);

// const bundesligaMatchDates = findDates(bundesligaData);
// console.log('Bundesliga', bundesligaMatchDates);

// const serieaMatchDates = findDates(serieaData);
// console.log('Serie A', serieaMatchDates);

// Returns all the dates in the League
function findDates(leagueData){
    const dates = new Set();
    const numRounds = leagueData.rounds.length;
    for(let i = 0; i < numRounds; i++){
        const matchdayMatches = leagueData.rounds[i].matches;
        for(let match of matchdayMatches){
            dates.add(match.date);
        }
    }
    return dates;
}

export { findDates };