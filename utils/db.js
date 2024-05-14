const mongoose = require("mongoose");
const chalk = require("chalk");

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(successMsg("Connected to DB"));
  } catch (error) {
    console.log(errorMsg("BD not connected", error));
  }
};

module.exports = connectDB;
