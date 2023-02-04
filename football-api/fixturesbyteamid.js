import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    params: {season: '2020', team: '33'},
    headers: {
      'X-RapidAPI-Key': '9c4deaf318msh0c5222871352babp16fb89jsnfe2c2ef108cc',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });
