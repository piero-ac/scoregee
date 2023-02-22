const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true
    }, 
    leagueStandings: {
        type: [String],
        teamID: {
            type: String,
            required: true
        },
        teamName: {
            type: String,
            required: true
        },
        teamPoints: {
            type: Number,
            required: true
        },
        teamRanking: {
            type: Number,
            required: true
        }
    }
})

const Standing = mongoose.Model('Standing', standingSchema);
modules.export = Standing;