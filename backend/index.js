//connect to database and start the server

import app from "./server.js" //we made this exportable earlier in the server file
import mongodb from "mongodb"
import dotenv from "dotenv" //allows us to access environment variables
import RestaurantsDAO from "./dao/restaurantsDAO.js" //might be from /api/dao/res...


dotenv.config() //load in/config dotenv 
const MongoClient = mongodb.MongoClient //get access to mongo client from mongodb

const port = process.env.PORT || 8000 //set port from environemnt variable, we named it PORT in the .env, if cannot access that port of 5000, make it 8000 by using ||

//connect to database
MongoClient.connect( //to connect, need uri which we named RESTREVIEWS_DB_URI in the .env file
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50, //only allows up to 50 ppl to connect HAD TO CHANGE THIS ALL, WAS PREVIOUSLY NAMED: poolSize , wtimeout , useNewUrlParse 
        writeConcern:{wtimeout: 2500}, //after 2500 milliseconds the request will time out
        useNewUrlParser: true, //mongodb/node.js driver rewrote how they do stuff so need this
        useUnifiedTopology: true 
    }
)

//now to catch errors
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
//now we do something
.then(async client => {
    await RestaurantsDAO.injectDB(client) //after we connect to database but BEFORE we start server below, we call inject db
    app.listen(port, () => {
        console.log('listening on port DONT KNOW WHICH ONE HAVE TO PUT HERE, removing ${port} worked lol')
    }) //this is what starts the web server after db is connected to
}) 