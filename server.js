"use strict";

const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const server = express();
const directoryToServe = "public";
const port = 3000;

// static public folder
server.use(express.static(path.join(__dirname, directoryToServe)));
server.set("view engine", "handlebars");

// Setup https
const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, "public/ssl", "server.crt")),
  key: fs.readFileSync(path.join(__dirname, "public/ssl", "server.key")),
  engine: "handlebars"
};

https.createServer(httpsOptions, server).listen(port, () => {
  console.log("Serving on Port ${port}");
});
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose
  .connect("mongodb://localhost/listOfPlayers")
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Load Idea Model
require("./models/Player");
const Player = mongoose.model("player");

// Handlebars Middleware
server.engine(
  "handlebars",
  exphbs({
    extname: "hbs",
    defaultLayout: "main"
  })
);

// Body Parser Middelware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Method override middleware
server.use(methodOverride("_method"));

// Index Route
server.get("/", (req, res) => {
  const title = "Moin !";
  res.render("index", {
    title: title
  });
});

// About Route
server.get("/table", (req, res) => {
  res.render("table");
});

// Player Index Page
server.get("/players", (req, res) => {
  Player.find({})
    .sort({ lastName: "asc" })
    .then(players => {
      res.render("indexOfPlayers", {
        players: players
      })
      
    })
    .catch(err => console.log(err));
});

//Get Add Player Form
server.get("/add", (req, res) => {
  res.render("add");
});

// Edit Player
server.get("/edit/:id", (req, res) => {
  Player.findOne({
    _id: req.params.id
  }).then(player => {
    res.render("edit", {
      player: player
    })
    
  })
  .catch(err => console.log(err));
});

// Edit Form process
server.put("/players/:id", (req, res) => {
  Player.findOne({
    _id: req.params.id
  }).then(player => {
    //new values
    player.playerID = req.body.playerID;
    player.lastName = req.body.lastName;
    player.firstName = req.body.firstName;
    player.dateOfBirth = req.body.dateOfBirth;

    player.save()
      .then(player=>{
        res.redirect('/players');
      })
      .catch(err => console.log(err));
      
  })
  .catch(err => console.log(err));
});

// Delete Player
server.delete('/players/:id', (req, res)=>{
  Player.remove({_id:req.params.id})
    .then(()=>{
      res.redirect('/players');
    })
    .catch(err=>console.log(err));
});

// Process Player
server.post("/add", (req, res) => {
  let errors = [];

  if (!req.body.playerID) {
    errors.push({ text: "Bitte Spielernummer eingeben" });
  }

  if (!req.body.lastName) {
    errors.push({ text: "Bitte Nachnamen eingeben" });
  }

  if (!req.body.firstName) {
    errors.push({ text: "Bitte Vornamen eingeben" });
  }

  if (!req.body.dateOfBirth) {
    errors.push({ text: "Bitte Geburtsdatum eingeben" });
  }

  if (errors.length > 0) {
    res.render("add", {
      errors: errors,
      playerID: req.body.playerID,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      dateOfBirth: req.body.dateOfBirth
    });
  } else {
    let newUser = {
      playerID: req.body.playerID,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      dateOfBirth: req.body.dateOfBirth
    };
    new Player(newUser).save().then(player => {
      res.redirect("/players");
    })
    .catch(err => console.log(err));
  }
});
