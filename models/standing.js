import mongoose from 'mongoose';

const standingSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true,
    }, 
    leagueID: {
        type: String,
        required: true
    },
    leagueSeason: {
        type: String,
        required: true
    },
    leagueStandings: [
        {
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
    ]
})

export const Standing = mongoose.model('Standing', standingSchema);
// module.exports = Standing;