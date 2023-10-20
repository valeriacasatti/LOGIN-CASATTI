import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  role: String,
});

export const usersModel = mongoose.model(usersCollection, userSchema);
