// require modules
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const passport = require("passport");
const LocalStratey = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const session = require("express-session");

// App Setup
const app = express();

// register view engine
app.set("view engine", "ejs");

// Middleware functions
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// passportjs logic
// Configuring the LocalStrategy
passport.use(
  new LocalStratey(async (username, password, done) => {
    try {
      const user = await User.findOne({ userName: username });
      //   check if user exists
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      //   check if passwords match
      const bcryptConfirm = await bcryptjs.compare(password, user.password);
      if (bcryptConfirm === false) {
        return done(null, false, { message: "Incorrect password" });
      }
      //   succesfully log in
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// configure the passport session mechanism
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Set up the app's routes
const membersRouter = require("./routes/members");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

// middleware functions
app.use("/members", membersRouter);

// redirect to the homepage
app.get("/", (req, res) => {
  res.redirect("/members");
});

// listen on the server
app.listen(process.env.PORT, () =>
  console.log(
    `Server running and listening for requests on port ${process.env.PORT} `
  )
);
