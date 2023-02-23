import { ObjectId } from "mongodb" 
import mongodb from "mongodb" //get access to object id, convert string to mongodb object id
const ObjectId = mongodb.ObjectId

let restaurants //store reference to our database

export default class RestaurantsDAO {
    static async injectDB(conn) { //inject database method, initially connect to db as soon as server starts, get reference to our restaurant db
        if (restaurants) { //if its already filled, just return
            return
        }
        try { //if not filled, fill that variable with reference to that specific database 
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants") //try to connect to database, give it env variable name of our db called RESTREVIEWS_NS
        } catch (e) {
            console.error(
                'Unable to establish a connection handle in restaurantsDAO: ${e}', //MIGHT HAVE TO REMOVE THIS ${E} if theres an error I don't know the fix to!!!
            )
        }
    }

static async getRestaurants({
    filters = null, //we put in what filters if we want to sort the data by what type of food, zipcode etc
    page = 0, //what page number 
    restaurantsPerPage = 20, //default to 20 restaurants per page

} = {}) {
    let query //we make a query, we do let query to make it empty unless there is a filter that is chosen such as name or cuisine or zipcode etc
    if (filters) { //QUERIES ARE SUPER IMPORTANT IN MONGODB, LEARN ABOUT THEM MORE
        if("name" in filters) {
            query = { $text: { $search: filters["name"] } } //to do a text search
        } else if ("cuisine" in filters) {
            query = {"cuisine": { $eq: filters["cuisine"] } } //if cuisine in the database equals ($eq) the cuisine that was chosen in the filter, search for it
        } else if ("zipcode" in filters) {
            query = { "address.zipcode": {$eq: filters["zipcode"] } }
        }
    } 

    let cursor //get cursor

    try {
        cursor = await restaurants //find all restaurants from db that go with the query that we passed in 
            .find(query) //if no query, return all restaurants
    } catch (e) { 
        console.error('Unable to issue find command, ${e}') //error if no restaurants
        return { restaurantsList: [], totalNumRestaurants: 0}
    }

    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page) //limit result to restaurants per page, and to get page number we do a skip

    try {
        const restaurantsList = await displayCursor.toArray() //set restaurant list to an array
        const totalNumRestaurants = await restaurants.countDocuments(query) //get total number of restaurants

        return {restaurantsList, totalNumRestaurants } //return restaurant list and total num of restaurants
    } catch (e) {
        console.error(
            'Unable to convert cursor to array or problem counting documents, ${e}'
        )
        return {restaurantsList: [], totalNumRestaurants: 0 }
    }
}

    static async getRestaurantByID(id) { //data aggregation from mongodb REALLY IMPORTANT and interesting
        try {
            const pipeline = [ //create a pipeline from mongodb, helps match different collections together
                {
                    $match: {
                        _id: new ObjectId(id), //specifically trying to match id from a specific restaurant
                    },
                },
                        {
                            $lookup: { //lookup reviews to add to result
                                from: "reviews",
                                let: {
                                    id: "$_id",
                                },
                                pipeline: [ //from reviews collection, create pipeline that matches restaurant id, and find all reviews that match restaurant id
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$restaurant_id", "$$id"],
                                            },
                                        },
                                    },
                                    {
                                        $sort: {
                                            date: -1,
                                        },
                                    },
                                ],
                                as: "reviews",
                            },
                        },
                        {
                            $addFields: {
                                reviews: "$reviews",
                            },
                        },
            ]
            return await restaurants.aggregate(pipeline).next() //aggregate the pipeline (collect everything together) and then return restaurants along with connected reviews
        } catch (e) {
            console.error('Something went wrong in getRestaurantByID: ${e}')
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = [] //empty array
        try {
            cuisines = await restaurants.distinct("cuisine") //get distinct cuisines (since restaurants typically have the same cuisine)
            return cuisines
        } catch (e) {
            console.error('Unable to get cuisines, {e}')
            return cuisines
        }
    }
}
