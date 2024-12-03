const mongoose = require('mongoose');
const { DB_URL } = require('./utils/config');

mongoose.connect(DB_URL)
    .then(()=> console.log('connected to db'))
    .catch(err=> console.error(err))