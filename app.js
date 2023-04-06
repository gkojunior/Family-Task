require('dotenv').config()
require('express-async-errors')

// extra security packages
const rateLimiter = require('express-rate-limit');

const express = require('express')
const app = express()
const authenticateUser = require('./middleware/auth')


// connecting to database
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/auth')
const taskRouter = require('./routes/task')

//error handler
const notFoundMidddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//middleware
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', authenticateUser,taskRouter)

app.use(notFoundMidddleware)
app.use(errorHandlerMiddleware)

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