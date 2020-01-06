const mongoose      = require("mongoose");

const courseSchema = new mongoose.Schema({
	name: String,
	description: String,
	semester: Number,

	documents: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Document"
		}
	]

});

module.exports = mongoose.model("Course", courseSchema);