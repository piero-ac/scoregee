import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
	teamID: { type: Number, required: true },
	teamName: { type: String, required: true },
	teamLogo: { type: String, required: true },
	teamCode: { type: String, required: true },
	teamCountry: { type: String, required: true },
	teamFounded: { type: Number, required: true },
});

export const Team = mongoose.model("Team", teamSchema);
