import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
	leagueID: { type: String, required: true },
	leagueName: { type: String, required: true },
	leagueCountry: { type: String, required: true },
	leagueLogo: { type: String, required: true },
});

export const League = mongoose.model("League", leagueSchema);
