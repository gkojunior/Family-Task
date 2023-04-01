const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'please provide a title'],
			maxlength: 100,
		},
		description: {
			type: String,
			required: [true, 'please provide a description'],
		},
		status: {
			type: String,
			enum: ["I'm working on it", 'Almost done'],
			default: "I'm working on it",
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'please provide a user'],
		},
	}, 
	{ timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
