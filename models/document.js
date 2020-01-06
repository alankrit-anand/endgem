const mongoose      = require("mongoose");

const documentSchema = new mongoose.Schema({
	name: String,
	type: String,
	downloads: Number,
	uploadDate: String,
	course: String,
	owner: String,
	drive_id: String
});

module.exports = mongoose.model("Document", documentSchema);