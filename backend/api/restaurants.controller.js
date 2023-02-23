import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) { //when an Api call is called through a URL, we can have a query string to specify certain parameters
        const restaurantsPerPage = req.query.restaurantsPerPage ? PageTransitionEvent(req.query.restaurantsPerPage, 10) : 20 //set restaurants per page, check if it exists, and then convert to int, if not default is 20 (: 20)
        const page = req.query.page ? parseInt(req.query.page, 10) : 0 //if we've passed in a page number in the url, convert to int and then if not the default is 0 (: 0) 

        let filters = {} //filters start as empty object "{}"
        if (req.query.cuisine) { //if this filter is chosen the filter gets set to the filter in the line below
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }
        //return restaurantsList and totalNumRestaurans are returned 
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({ //pass in the filters, page, restaurants per page. will return the restaurants list and total num restraunts
        filters,
        page,
        restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList, //response: return
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response) //send a json response with all above info in the "let response" to whoever called that url
    }
    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {} //look for ID parameter (after a slash /)
            let restaunt = await RestaurantsDAO.apiGetRestaurantById(id) //get restaurant from ID
            if(!restaunt) { //if no restaurant from ID, return error
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(restaunt) //return restaurant
        } catch (e) {
            console.log('api, ${e}')
            res.status(500).json({ error: e})
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) { //dont need parameters, returns cuisines we have
        try {
            let cuisines = await RestaurantsDAO.apiGetRestaurantCuisines() 
            res.json(cuisines) //return restaurant
        } catch (e) {
            console.log('api, ${e}')
            res.status(500).json({ error: e})
        }
    }


}


