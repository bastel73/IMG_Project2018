const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PlayerSchema = new Schema({
    playerID:{
        type: Number,
        required: true
    },
    lastName: {
    type: String,
    required: true
    },
    firstName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
});

mongoose.model('player', PlayerSchema);