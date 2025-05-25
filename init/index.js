const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data"); // make sure data.js exports an object with 'data' key

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  console.log("DB connected");
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "6810d363d35869a06d4711af"
  }));
  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

initDB();
