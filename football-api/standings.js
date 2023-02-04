// https://www.api-football.com/documentation-v3#tag/Standings/operation/get-standings
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");


const eplOptions = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
    params: {league: '39', season: '2022'},
    headers: {
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      'x-rapidapi-key': '9c4deaf318msh0c5222871352babp16fb89jsnfe2c2ef108cc'
    }
};

axios.request(eplOptions)
    .then((response) => {
        // console.log(response.data);
        displayLeagueStandings(response.data);
    })
    .catch((e) => {
        console.error(e);
    })

function displayLeagueStandings(data){
    const league = data.response[0].league;
    const { id: leagueID, name: leagueName, country : leagueCountry, standings} = league;
    console.log(`League ID: ${leagueID} - Name: ${leagueName} - Country: ${leagueCountry}`);
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++');
    
    const leagueStandings = standings[0];
    for(let t of leagueStandings){
        const { rank: teamRank, team : teamInfo, points, goalsDiff, form, all, home, away   } = t;
        const { id, name} = teamInfo;
        const { played, win, draw, lose, goals } = all;
        const { for: forGoals, against: againstGoals } = goals;

        console.log(`Rank: ${teamRank} - Team ID: ${id} - Name: ${name}`);
        console.log(`Points: ${points} - Goals Difference: ${goalsDiff} - Form: ${form}`);
        console.log(`Games Played: ${played} - W/D/L: ${win}/${draw}/${lose}`);
        console.log(`Goals - For: ${forGoals}, Against: ${againstGoals}`);
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++');

    }
}

/**
 * League ID: 39 - Name: Premier League - Country: England
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 1 - Team ID: 42 - Name: Arsenal
Points: 50 - Goals Difference: 28 - Form: LWWDW
Games Played: 20 - W/D/L: 16/2/2
Goals - For: 45, Against: 17
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 2 - Team ID: 50 - Name: Manchester City
Points: 45 - Goals Difference: 33 - Form: WWLWD
Games Played: 20 - W/D/L: 14/3/3
Goals - For: 53, Against: 20
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 3 - Team ID: 34 - Name: Newcastle
Points: 39 - Goals Difference: 22 - Form: DWDDW
Games Played: 20 - W/D/L: 10/9/1
Goals - For: 33, Against: 11
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 4 - Team ID: 33 - Name: Manchester United
Points: 39 - Goals Difference: 7 - Form: LDWWW
Games Played: 20 - W/D/L: 12/3/5
Goals - For: 32, Against: 25
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 5 - Team ID: 47 - Name: Tottenham
Points: 36 - Goals Difference: 9 - Form: WLLWL
Games Played: 21 - W/D/L: 11/3/7
Goals - For: 40, Against: 31
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 6 - Team ID: 36 - Name: Fulham
Points: 32 - Goals Difference: 2 - Form: DLLWW
Games Played: 22 - W/D/L: 9/5/8
Goals - For: 32, Against: 30
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 7 - Team ID: 51 - Name: Brighton
Points: 31 - Goals Difference: 10 - Form: DWWLW
Games Played: 19 - W/D/L: 9/4/6
Goals - For: 37, Against: 27
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 8 - Team ID: 55 - Name: Brentford
Points: 30 - Goals Difference: 4 - Form: DWWWD
Games Played: 20 - W/D/L: 7/9/4
Goals - For: 32, Against: 28
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 9 - Team ID: 49 - Name: Chelsea
Points: 30 - Goals Difference: 1 - Form: DDWLL
Games Played: 21 - W/D/L: 8/6/7
Goals - For: 22, Against: 21
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 10 - Team ID: 40 - Name: Liverpool
Points: 29 - Goals Difference: 9 - Form: DLLWW
Games Played: 19 - W/D/L: 8/5/6
Goals - For: 34, Against: 25
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 11 - Team ID: 66 - Name: Aston Villa
Points: 28 - Goals Difference: -4 - Form: WWDWL
Games Played: 20 - W/D/L: 8/4/8
Goals - For: 23, Against: 27
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 12 - Team ID: 52 - Name: Crystal Palace
Points: 24 - Goals Difference: -9 - Form: DDLLW
Games Played: 20 - W/D/L: 6/6/8
Goals - For: 18, Against: 27
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 13 - Team ID: 65 - Name: Nottingham Forest
Points: 21 - Goals Difference: -19 - Form: DWWDL
Games Played: 20 - W/D/L: 5/6/9
Goals - For: 16, Against: 35
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 14 - Team ID: 46 - Name: Leicester
Points: 18 - Goals Difference: -7 - Form: DLLLL
Games Played: 20 - W/D/L: 5/3/12
Goals - For: 28, Against: 35
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 15 - Team ID: 63 - Name: Leeds
Points: 18 - Goals Difference: -7 - Form: DLDDL
Games Played: 19 - W/D/L: 4/6/9
Goals - For: 26, Against: 33
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 16 - Team ID: 48 - Name: West Ham
Points: 18 - Goals Difference: -8 - Form: WLDLL
Games Played: 20 - W/D/L: 5/3/12
Goals - For: 17, Against: 25
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 17 - Team ID: 45 - Name: Everton
Points: 18 - Goals Difference: -12 - Form: WLLLD
Games Played: 21 - W/D/L: 4/6/11
Goals - For: 16, Against: 28
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 18 - Team ID: 39 - Name: Wolves
Points: 17 - Goals Difference: -18 - Form: LWDLW
Games Played: 20 - W/D/L: 4/5/11
Goals - For: 12, Against: 30
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 19 - Team ID: 35 - Name: Bournemouth
Points: 17 - Goals Difference: -23 - Form: DLLLL
Games Played: 20 - W/D/L: 4/5/11
Goals - For: 19, Against: 42
+++++++++++++++++++++++++++++++++++++++++++++++++++++
Rank: 20 - Team ID: 41 - Name: Southampton
Points: 15 - Goals Difference: -18 - Form: LWLLL
Games Played: 20 - W/D/L: 4/3/13
Goals - For: 17, Against: 35
+++++++++++++++++++++++++++++++++++++++++++++++++++++
 */