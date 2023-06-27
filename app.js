// require modules
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

// App Setup
const app = express();

app.listen(4000, () =>
  console.log(`Server running and listening for requests on port 4000`)
);

// register view engine
app.set("view engine", "ejs");

// Set up the app's routes
const membersRouter = require("./routes/members");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

// middleware functions
app.use("/members", membersRouter);
