const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

const connection = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = connection;