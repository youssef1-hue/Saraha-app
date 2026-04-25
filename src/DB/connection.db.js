import mongoose from "mongoose";
import { UserModel } from "../models/user.model.js";

export const connectDB = async () => {
  try {
    // نقرأ المتغير مباشرة من process.env
    const uri = process.env.DB_URI;

    if (!uri) {
      throw new Error("DB_URI is not defined in environment variables!");
    }

    await mongoose.connect(uri);
    console.log("DB connected successfully❤️");
    
    await UserModel.syncIndexes();
  } catch (error) {
    console.log("DB connection failed❌", error.message);
    throw error;
  }
};
