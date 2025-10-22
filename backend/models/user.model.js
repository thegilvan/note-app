const mongoose = require("mongoose");
const Schema = mongoose.Schema; //chamo o constructor Schema do mongoose

const userSchema = new Schema({
  //Schema é a classe do mongo
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema);
