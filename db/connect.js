const mongoose = require('mongoose')

const connectDB = (url) => {
  mongoose.set('strictQuery', false);

  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
  })
}

module.exports = connectDB