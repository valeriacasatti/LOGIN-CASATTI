import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://valeriacasatti:tgadm001@cluster0.0ctypqf.mongodb.net/ecommerceDB?retryWrites=true&w=majority"
    );
    console.log("database connected");
  } catch (error) {
    console.log(`error connecting database: ${error.message}`);
  }
};
