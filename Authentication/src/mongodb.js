const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/LoginSingup")
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const logInSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type:String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("CollectionTry", logInSchema);
module.exports = collection;
