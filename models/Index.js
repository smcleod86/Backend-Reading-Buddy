const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/reading-buddy',
    { useNewUrlParser: true}
);

let db = mongoose.connection;

db.once('open', () => {
    console.log(`🌀🌀🌀🌀Connected to MongoDB at ${db.host}:${db.port}`);
})

db.on('error', err => {
    console.log(`🔴🔴🔴🔴 Database error`);
    console.error(err);
})

module.exports.UserExperince = require('./UserExperience');