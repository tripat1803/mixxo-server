import mongoose from "mongoose";

export const connectDatabase = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;
    connection.on("connected", (req, res) => {
      console.log(`MongoDB is Connected with Host :${connection.host}`);
    });
    connection.on("disconnected", (req, res) => {
      console.log(`MongoDB is disconnected from Host :${connection.host}`);
    });
    connection.on("error", (error) => {
      console.log(`MongoDB Connection Error :${error.message}`);
    });
  } catch (error) {
    console.log(`MongoDB Connection Error :${error.message}`);
  }
};
