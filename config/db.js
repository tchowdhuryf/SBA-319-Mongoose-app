const mongoose = require("mongoose");

const conn = () => {
  try {
    //connect to the database
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.once("open", () => {
      console.log("connected to mongodb");
    });
  } catch (error) {
    console.log(`Something went wrong connecting to mongodb: ${error.message}`);
  }
};

module.exports = conn;
