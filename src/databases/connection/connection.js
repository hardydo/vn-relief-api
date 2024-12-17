import mongoose from "mongoose";
import ConfigDB from "../config/config-db.js";

async function DBconnect() {
  await mongoose.connect(ConfigDB.uri)
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.error(`MongoDB connection error: ${err}`));
}

export default DBconnect
