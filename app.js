require('dotenv').config()

const express = require('express')
const app = express()

// connecting to database
const connectDB = require('./db/connect')

app.use(express.json())

const port = process.env.Port || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, console.log(`Server listening on port ${port}...`))
	} catch (error) {
		console.log(error)
	}
}

start()