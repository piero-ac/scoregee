# ScoreGee

ScoreGee is an web application that shows information on matches for the Top 5 European leagues.
Users can view information such as statistics, lineups, and results for regular season matches.

### Leagues

<ul>
<li> Bundesliga (Germany) </li>
<li> La Liga (Spain) </li>
<li> Ligue 1 (France) </li>
<li> Premier League (England) </li>
<li> Serie A (Italy) </li>
</ul>

### Available Seasons

<ul>
<li> 2022-2023 (current) </li>
<li> 2021-2022 </li>
<li> 2020-2021 </li>
<li> 2019-2020 </li>
</ul>

## Description

This project draws inspiration from LiveScore.com. We wanted to create our version of this website using data obtained from API-Football. Project was made during the Spring 2023 semester for CPS4951 - Senior Capstone.

### Technologies

<ul>
<li>Frontend: HTML, CSS, JS</li>
<li>Backend: NodeJS, Express, Axios</li>
<li>Database: MongoDB, Mongoose</li>
<li>API: API-Football https://www.api-football.com/documentation-v3</li>
</ul>

### Current Version Specific Information

This version of the project continues to use a MongoDB database stores information for over 7000 matches and over 100 teams.
Currently, due to the design of API-Football, we aren't able to obtain lineup information for multiple matches at once. Therefore, it was not possible to store that information in the database for all of the matches. Displaying a match's information currently requires an API call that slows done page loading time.

### To-Do

<ul>
<li> Implement client-side caching of lineup information to reduce API calls </li>
<li> Improve Website Visuals </li>
<li> Create scripts to periodically update fixture information </li>
<li> Edit client side code to retrive data separately using new routes</li>
<li> Move from displaying matchdate fixtures, to fixtures by month</li>
</ul>
