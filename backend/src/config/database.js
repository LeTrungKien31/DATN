import mongoose from "mongoose";

import { env } from "./env.js";

export const connectDatabase = async () => {
  await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
