const Task = require('../models/task')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllTask = async (req, res) => {
	const tasks = await Task.find({ createdBy: req.user.userId }).sort(
		'createdAt'
	)

	res.status(StatusCodes.OK).json({ tasks, count: tasks.length })
}
const getTask = async (req, res) => {
	const {
		user: { userId },
		params: { id: taskId },
	} = req

	const task = await Task.findOne({
		_id: taskId,
		createdBy: userId,
	})

	if (!task) {
		throw new NotFoundError(`No task with id ${taskId}`)
	}

	res.status(StatusCodes.OK).json({ task })
}
const createTask = async (req, res) => {
	req.body.createdBy = req.user.userId
	const task = await Task.create(req.body)
	res.status(StatusCodes.CREATED).json({ task })
}
const updateTask = async (req, res) => {
	const {
		body: { task, date },
		user: { userId },
		params: { id: taskId },
	} = req

	if (task === '' || date === '') {
		throw new BadRequestError('Task or Date fields cannot be empty')
	}
	const tasks = await Task.findByIdAndUpdate(
		{ _id: taskId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true }
	)
	if (!tasks) {
		throw new NotFoundError(`No job with id ${taskId}`)
	}
	res.status(StatusCodes.OK).json({ tasks })
}
const deleteTask = async (req, res) => {
	const {
		user: { userId },
		params: { id: taskId },
	} = req

	const task = await Task.findByIdAndRemove({
		_id: taskId,
		createdBy: userId,
	})
	if (!task) {
		throw new NotFoundError(`No job with id ${taskId}`)
	}
	res.status(StatusCodes.OK).json({ msg: 'The entry was deleted.' })
}

module.exports = {
	getAllTask,
	getTask,
	createTask,
	updateTask,
	deleteTask,
}
