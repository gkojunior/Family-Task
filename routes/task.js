const express = require('express')
const {register} = require('../controllers/auth')
const router = express.Router()

const {
	createTask,
	deleteTask,
	getAllTask,
	updateTask,
	getTask,
} = require('../controllers/task')

router.route('/').post(createTask).get(getAllTask)

router.route('/:id').get(getTask).delete(deleteTask).patch(updateTask)

module.exports = router