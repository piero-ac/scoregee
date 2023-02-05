import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups',
  params: {fixture: '867946'},
  headers: {
    'X-RapidAPI-Key': '9c4deaf318msh0c5222871352babp16fb89jsnfe2c2ef108cc',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	// console.log(response.data);
    displayFixtureLineups(response.data);
}).catch(function (error) {
	console.error(error);
});

function displayFixtureLineups(res){
    const data = res.response;
    const { team: team1, coach: coach1, formation: formation1, startXI: startXI1, substitutes: subs1 } = data[0];
    const { team: team2, coach: coach2, formation: formation2, startXI: startXI2, substitutes: subs2 } = data[1];
    const {id: team1id, name: team1Name, logo: team1Logo, color: team1Color } = team1;
    const {id: team2id, name: team2Name, logo: team2Logo, color: team2Color } = team2;
    const {id: coach1ID, name: coach1Name, photo: coach1Photo } = coach1;
    const {id: coach2ID, name: coach2Name, photo: coach2Photo } = coach2;

    // Output Team 1 Starting XI + Coach + Formation + 
    console.log(`Team: ${team1Name} Coach: ${coach1Name}`);
    console.log(`Formation: ${formation1}`);
    console.log(`Starting XI`);
    for(const p of startXI1){
        const { player : { id, name, number, pos, grid} } = p;
        console.log(`POS: ${pos} - Number: ${number} - Name: ${name} `);
    }
    console.log(`Substitutes`);
    for(const s of subs1){
        const {player : { id, name, number, pos, grid } } = s;
        console.log(`POS: ${pos} - Number: ${number} - Name: ${name} `);
    }
    
    console.log("+++++++++++++++++++++++++++++++++++++++++");

    console.log(`Team: ${team2Name} Coach: ${coach2Name}`);
    console.log(`Formation: ${formation2}`);
    console.log(`Starting XI`);
    for(const p of startXI2){
        const { player : { id, name, number, pos, grid} } = p;
        console.log(`POS: ${pos} - Number: ${number} - Name: ${name} `);
    }
    console.log(`Substitutes`);
    for(const s of subs2){
        const {player : { id, name, number, pos, grid } } = s;
        console.log(`POS: ${pos} - Number: ${number} - Name: ${name} `);
    }
}

/**
 Team: Crystal Palace Coach: P. Vieira
Formation: 4-2-3-1
Starting XI
POS: G - Number: 13 - Name: Guaita 
POS: D - Number: 17 - Name: N. Clyne 
POS: D - Number: 16 - Name: J. Andersen 
POS: D - Number: 6 - Name: M. Guéhi 
POS: D - Number: 3 - Name: T. Mitchell 
POS: M - Number: 15 - Name: J. Schlupp 
POS: M - Number: 10 - Name: E. Eze 
POS: M - Number: 28 - Name: C. Doucouré 
POS: M - Number: 9 - Name: J. Ayew 
POS: M - Number: 11 - Name: W. Zaha 
POS: F - Number: 22 - Name: O. Édouard 
Substitutes
POS: F - Number: 14 - Name: J. Mateta 
POS: M - Number: 4 - Name: L. Milivojević 
POS: M - Number: 23 - Name: M. Ebiowei 
POS: M - Number: 19 - Name: W. Hughes 
POS: M - Number: 44 - Name: J. Riedewald 
POS: F - Number: 48 - Name: L. Plange 
POS: D - Number: 26 - Name: C. Richards 
POS: G - Number: 21 - Name: S. Johnstone 
POS: D - Number: 2 - Name: J. Ward 
+++++++++++++++++++++++++++++++++++++++++
Team: Arsenal Coach: Mikel Arteta
Formation: 4-3-3
Starting XI
POS: G - Number: 1 - Name: A. Ramsdale 
POS: D - Number: 6 - Name: Gabriel Magalhães 
POS: D - Number: 4 - Name: B. White 
POS: D - Number: 12 - Name: W. Saliba 
POS: M - Number: 34 - Name: G. Xhaka 
POS: M - Number: 5 - Name: T. Partey 
POS: D - Number: 35 - Name: O. Zinchenko 
POS: M - Number: 8 - Name: M. Ødegaard 
POS: F - Number: 7 - Name: B. Saka 
POS: F - Number: 9 - Name: Gabriel Jesus 
POS: F - Number: 11 - Name: Gabriel Martinelli 
Substitutes
POS: F - Number: 14 - Name: E. Nketiah 
POS: D - Number: 3 - Name: K. Tierney 
POS: M - Number: 23 - Name: A. Lokonga 
POS: G - Number: 30 - Name: M. Turner 
POS: M - Number: 25 - Name: Mohamed Elneny 
POS: F - Number: 19 - Name: N. Pépé 
POS: D - Number: 16 - Name: R. Holding 
POS: D - Number: 17 - Name: Cédric Soares 
POS: F - Number: 24 - Name: R. Nelson
 */