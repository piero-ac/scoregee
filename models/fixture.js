import mongoose from 'mongoose';

const fixtureSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    referee: { type: String, required: true },
    timezone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true},
    timestamp: { type: Number, required: true },
    periods: {
        first: { type: String, required: true },
        second: { type: String, required: true }
    },
    venue: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        city: { type: String, required: true }
    },
    status: {
        long: { type: String, required: true },
        short: { type: String, required: true },
        elapsed: { type: String, required: true }
    }
});

const leagueSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    logo: { type: String, required: true },
    flag: { type: String, required: true },
    season: { type: Number, required: true },
    round: { type: String, required: true }
});
  
const teamSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    winner: { type: String, required: true }
});

const scoreSchema = new mongoose.Schema({
    home: { type: String, required: true },
    away: { type: String, required: true }
});

const goalSchema = new mongoose.Schema({
    home: { type: String, required: true },
    away: { type: String, required: true }
});

const fixtureModelSchema = new mongoose.Schema({
    fixture: { type: fixtureSchema, required: true },
    league: { type: leagueSchema, required: true },
    teams: {
        home: { type: teamSchema, required: true },
        away: { type: teamSchema, required: true }
    },
    goals: { type: goalSchema, required: true },
    score: {
        halftime: { type: scoreSchema, required: true },
        fulltime: { type: scoreSchema, required: true },
        extratime: { type: scoreSchema, required: false },
        penalty: { type: scoreSchema, required: false }
    }
});


export const Fixture = mongoose.model('Fixture', fixtureModelSchema);
  