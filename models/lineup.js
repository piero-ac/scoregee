import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true},
    logo: { type: String, required: true},
    color: { type: String, required: false}
})

const coachSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true},
    photo: { type: String, required: true}
})

const playerLineupSchema = new mongoose.Schema({
    startXI: [
        {
            id: { type: Number, required: true},
            name: { type: String, required: true},
            number: { type: Number, required: true},
            pos: { type: String, required: true},
            grid: { type: String, required: false }
        }
    ],
    substitutes: [
        {
            id: { type: Number, required: true},
            name: { type: String, required: true},
            number: { type: Number, required: true},
            pos: { type: String, required: true},
            grid: { type: String, required: false }
        }
    ]
})

const fixtureLineupModelSchema = new mongoose.Schema({
    fixtureid: { type: Number, required: true },
    teams: {
        homeTeam: { type: teamSchema, required: true },
        awayTeam: { type: teamSchema, required: true }
    },
    coaches: {
        homeCoach: {type: coachSchema, required: true},
        awayCoach: {type: coachSchema, required: true}  
    },
    formations: { 
        homeFormation: { type: String, required: true},
        awayFormation: { type: String, required: true }
    },
    lineups: {
        homeLineup: { type: playerLineupSchema, required: true},
        awayLineup: { type: playerLineupSchema, required: true}
    }
})

export const FixtureLineup = mongoose.model('FixtureLineup', fixtureLineupModelSchema);