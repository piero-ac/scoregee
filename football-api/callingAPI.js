import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://football98.p.rapidapi.com/premierleague/fixtures',
  headers: {
    'X-RapidAPI-Key': '9c4deaf318msh0c5222871352babp16fb89jsnfe2c2ef108cc',
    'X-RapidAPI-Host': 'football98.p.rapidapi.com'
  }
};

axios.request(options)
    .then(function (response) {
	    console.log(response.data);
    })
    .catch(function (error) {
	    console.error(error);
    });