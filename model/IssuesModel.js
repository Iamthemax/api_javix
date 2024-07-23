const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const issueSchema = new mongoose.Schema({
	issueNo: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	ngoId: {
		type: String,
		required: false
	},
	issueTitle: {
		type: String,
		required: true
	},
	issueDetails: {
		type: String,
		required: true
	},
	status: {
		type: Number,
		required: false,
		default: 0
	},
	comments: {
		type: String,
		required: false
	},
	is_active: {
		type: Boolean,
		default: true,
	},
	is_deleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
    updatedAt: {
		type: Date,
		default: Date.now,
	},
});
const IssuesModel = mongoose.model("Issues", issueSchema);



module.exports = IssuesModel;