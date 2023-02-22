//https://www.api-football.com/documentation-v3#tag/Leagues/operation/get-leagues
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");
import { config } from "./config.js";

const englandLeagues = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    params: {country: 'England'},
    headers: {
        'X-RapidAPI-Key': config.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
}

const italyLeagues = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    params: {country: 'Italy'},
    headers: {
        'X-RapidAPI-Key': config.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
}

const germanyLeagues = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    params: {country: 'Germany'},
    headers: {
        'X-RapidAPI-Key': config.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
}

const spainLeagues = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    params: {country: 'Spain'},
    headers: {
        'X-RapidAPI-Key': config.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
}

const franceLeagues = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    params: {country: 'France'},
    headers: {
        'X-RapidAPI-Key': config.RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
}

// Get league name and leagueids in England
// League Name: Premier League - ID: 39
// League Name: Championship - ID: 40
// League Name: EFL Trophy - ID: 46
// League Name: FA Cup - ID: 45
// League Name: FA Trophy - ID: 47
// League Name: League Cup - ID: 48
// League Name: National League - ID: 43
// League Name: League One - ID: 41
// League Name: League Two - ID: 42
// League Name: Community Shield - ID: 528
// League Name: FA WSL - ID: 44
// League Name: National League - Play-offs - ID: 49
// League Name: National League - North - ID: 50
// League Name: National League - South - ID: 51
// League Name: Non League Div One - Isthmian North - ID: 52
// League Name: Non League Div One - Isthmian South Central - ID: 53
// League Name: Non League Div One - Northern West - ID: 54
// League Name: Non League Div One - Northern Midlands - ID: 55
// League Name: Non League Div One - Southern South - ID: 56
// League Name: Non League Div One - Isthmian South East - ID: 57
// League Name: Non League Premier - Isthmian - ID: 58
// League Name: Non League Premier - Northern - ID: 59
// League Name: Non League Premier - Southern South - ID: 60
// League Name: FA Women's Cup - ID: 698
// League Name: Community Shield Women - ID: 670
// League Name: U18 Premier League - North - ID: 695
// League Name: U18 Premier League - South - ID: 696
// League Name: WSL Cup - ID: 697
// League Name: Women's Championship - ID: 699
// League Name: Premier League 2 Division One - ID: 702
// League Name: Professional Development League - ID: 703
// League Name: Premier League Cup - ID: 871
// League Name: Non League Premier - Southern Central - ID: 931
// League Name: Non League Div One - Northern East - ID: 932
// League Name: Non League Div One - Southern Central - ID: 933
// axios.request(englandLeagues)
//     .then(function (response) {
// 	    console.log(response.data);
//         displayLeagueInformation(response.data.response);
//     }).catch(function (error) {
// 	    console.error(error);
//     });

// Get league name and leagueids in Italy
/**
League Name: Serie A - ID: 135
League Name: Super Cup - ID: 547
League Name: Serie B - ID: 136
League Name: Coppa Italia - ID: 137
League Name: Serie C - Girone A - ID: 138
League Name: Serie A Women - ID: 139
League Name: Serie C - Girone B - ID: 942
League Name: Serie C - Girone C - ID: 943
League Name: Serie D - Girone A - ID: 426
League Name: Serie D - Girone B - ID: 427
League Name: Serie D - Girone C - ID: 428
League Name: Serie D - Girone D - ID: 429
League Name: Serie D - Girone E - ID: 430
League Name: Serie D - Girone F - ID: 431
League Name: Serie D - Girone G - ID: 432
League Name: Serie D - Girone H - ID: 433
League Name: Serie D - Girone I - ID: 434
League Name: Coppa Italia Primavera - ID: 704
League Name: Campionato Primavera - 1 - ID: 705
League Name: Campionato Primavera - 2 - ID: 706
League Name: Super Cup Primavera - ID: 817
League Name: Coppa Italia Serie C - ID: 891
League Name: Coppa Italia Serie D - ID: 892
 */
// axios.request(italyLeagues)
//     .then(function (response) {
// 	    // console.log(response.data);
//         displayLeagueInformation(response.data.response);
//     }).catch(function (error) {
// 	    console.error(error);
//     });

// Get league name and leagueids in France
/**
 League Name: Ligue 1 - ID: 61
League Name: Ligue 2 - ID: 62
League Name: National 1 - ID: 63
League Name: Coupe de France - ID: 66
League Name: Coupe de la Ligue - ID: 65
League Name: National 2 - Group A - ID: 67
League Name: National 2 - Group B - ID: 68
League Name: National 2 - Group C - ID: 69
League Name: National 2 - Group D - ID: 70
League Name: Trophée des Champions - ID: 526
League Name: Feminine Division 1 - ID: 64
League Name: National 3 - Group A - ID: 461
League Name: National 3 - Group B - ID: 462
League Name: National 3 - Group C - ID: 463
League Name: National 3 - Group D - ID: 464
League Name: National 3 - Group E - ID: 465
League Name: National 3 - Group F - ID: 466
League Name: National 3 - Group H - ID: 467
League Name: National 3 - Group I - ID: 468
League Name: National 3 - Group J - ID: 469
League Name: National 3 - Group K - ID: 470
League Name: National 3 - Group L - ID: 471
League Name: National 3 - Group M - ID: 472
 */
// axios.request(franceLeagues)
// .then(function (response) {
//     // console.log(response.data);
//     displayLeagueInformation(response.data.response);
// }).catch(function (error) {
//     console.error(error);
// });

// Get league name and leagueids in Spain
/**
 League Name: La Liga - ID: 140
League Name: Segunda División - ID: 141
League Name: Primera División Femenina - ID: 142
League Name: Super Cup - ID: 556
League Name: Copa del Rey - ID: 143
League Name: Primera División RFEF - Group 1 - ID: 435
League Name: Primera División RFEF - Group 2 - ID: 436
League Name: Primera División RFEF - Group 3 - ID: 437
League Name: Primera División RFEF - Group 4 - ID: 438
League Name: Tercera División RFEF - Group 1 - ID: 439
League Name: Tercera División RFEF - Group 2 - ID: 440
League Name: Tercera División RFEF - Group 3 - ID: 441
League Name: Tercera División RFEF - Group 4 - ID: 442
League Name: Tercera División RFEF - Group 5 - ID: 443
League Name: Tercera División RFEF - Group 6 - ID: 444
League Name: Tercera División RFEF - Group 7 - ID: 445
League Name: Tercera División RFEF - Group 8 - ID: 446
League Name: Tercera División RFEF - Group 9 - ID: 447
League Name: Tercera División RFEF - Group 10 - ID: 448
League Name: Tercera División RFEF - Group 11 - ID: 449
League Name: Tercera División RFEF - Group 12 - ID: 450
League Name: Tercera División RFEF - Group 13 - ID: 451
League Name: Tercera División RFEF - Group 14 - ID: 452
League Name: Tercera División RFEF - Group 15 - ID: 453
League Name: Tercera División RFEF - Group 16 - ID: 454
League Name: Tercera División RFEF - Group 17 - ID: 455
League Name: Tercera División RFEF - Group 18 - ID: 456
League Name: Primera División RFEF - Group 5 - ID: 692
League Name: Copa Federacion - ID: 735
League Name: Segunda División RFEF - Group 1 - ID: 875
League Name: Segunda División RFEF - Group 2 - ID: 876
League Name: Segunda División RFEF - Group 3 - ID: 877
League Name: Segunda División RFEF - Group 4 - ID: 878
League Name: Segunda División RFEF - Group 5 - ID: 879
 */
// axios.request(spainLeagues)
// .then(function (response) {
//     // console.log(response.data);
//     displayLeagueInformation(response.data.response);
// }).catch(function (error) {
//     console.error(error);
// });

// Get league name and leagueids in Germany
/**
 *League Name: Bundesliga - ID: 78
League Name: 2. Bundesliga - ID: 79
League Name: 3. Liga - ID: 80
League Name: Super Cup - ID: 529
League Name: DFB Pokal - ID: 81
League Name: Frauen Bundesliga - ID: 82
League Name: U19 Bundesliga - ID: 488
League Name: Regionalliga - Bayern - ID: 83
League Name: Regionalliga - Nord - ID: 84
League Name: Regionalliga - Nordost - ID: 85
League Name: Regionalliga - SudWest - ID: 86
League Name: Regionalliga - West - ID: 87
League Name: DFB Junioren Pokal - ID: 715
League Name: Oberliga - Schleswig-Holstein - ID: 744
League Name: Oberliga - Hamburg - ID: 745
League Name: Oberliga - Mittelrhein - ID: 746
League Name: Oberliga - Westfalen - ID: 747
League Name: Oberliga - Niedersachsen - ID: 748
League Name: Oberliga - Bremen - ID: 749
League Name: Oberliga - Hessen - ID: 750
League Name: Oberliga - Niederrhein - ID: 751
League Name: Oberliga - Rheinland-Pfalz / Saar - ID: 752
League Name: Oberliga - Baden-Württemberg - ID: 753
League Name: Oberliga - Nordost-Nord - ID: 754
League Name: Oberliga - Nordost-Süd - ID: 755
League Name: Oberliga - Bayern Nord - ID: 938
League Name: Oberliga - Bayern Süd - ID: 939
League Name: DFB Pokal - Women - ID: 947
 */
// axios.request(germanyLeagues)
// .then(function (response) {
//     // console.log(response.data);
//     displayLeagueInformation(response.data.response);
// }).catch(function (error) {
//     console.error(error);
// });


function displayLeagueInformation(leagues){
    for(let item of leagues){
        const { name: leagueName, id} = item.league;
        console.log(`League Name: ${leagueName} - ID: ${id}`);
    }
}

