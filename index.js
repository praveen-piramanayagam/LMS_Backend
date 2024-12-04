const mongoose = require('mongoose');
const { DB_URL } = require('./utils/config');
const app = require('./app');

mongoose.connect(DB_URL)
    .then(()=> {
        console.log('connected to database...');
        
        app.listen(3001,()=>{
            console.log("Server running in port 3001");  
        })
    }
    )
    .catch(err=> console.error(err))

