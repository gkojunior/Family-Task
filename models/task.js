const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'please provide a title'],
			maxlength: 50,
		},
		description: {
			type: String,
			required: [true, 'please provide a description'],
			maxlength: 100,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: ['Son', 'Daughter', 'Mom', 'Dad', 'Everyone'],
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
