import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"
//we need this above because we will have our routes in separate file

//make express app
const app = express()

app.use(cors()) //express will use our cors module
app.use(express.json()) //has body parser, which allows our server to accept json in body of a request, allows it to read json

app.use("/api/v1/restaurants", restaurants) //general format for api is api/version/api name, route file name. 
app.use("*", (req,res) => res.status(404).json({ error: "not found LLL"})) //if user goes to different route that doesnt exist "*" (wildcard) then return error

//now we need to export app as module, then we can import this module in the file that accesses the database
export default app //

