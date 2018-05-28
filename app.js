const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const directoryToServe = 'public';
const port = 3000;
// static public folder
app.use(express.static(path.join(__dirname, directoryToServe)));
app.set('view engine', 'handlebars');
// Setup https
const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'public/ssl','server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'public/ssl','server.key'))
};


https.createServer(httpsOptions, app)
    .listen(port, ()=>{
        console.log('Serving on Port ${port}');
    });
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/listOfPlayers')
.then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Load Idea Model
require('./models/Player');
const Player = mongoose.model('player');

// Handlebars Middleware
app.engine('handlebars', exphbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));


// Index Route
app.get('/', (req, res)=>{
    const title = 'Moin !';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/table', (req, res)=>{
    res.render('table');
});

// Add Player
app.get('/add', (req, res)=>{
    res.render('player/add');
});



