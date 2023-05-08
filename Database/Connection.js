const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set('strictPopulate', false);
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.mongooUrl);
    console.log("Database connected");
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = dbConnection;
