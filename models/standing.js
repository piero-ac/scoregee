import mongoose from "mongoose";

const standingSchema = new mongoose.Schema({
	leagueID: { type: String, required: true },
	leagueSeason: { type: String, required: true },
	leagueStandings: [
		{
			teamID: { type: String, required: true },
			teamPoints: { type: Number, required: true },
			teamRanking: { type: Number, required: true },
		},
	],
});

export const Standing = mongoose.model("Standing", standingSchema);
