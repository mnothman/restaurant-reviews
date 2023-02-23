import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js" //import this file for the router methods to review restaurants on line 9

const router = express.Router() //get access to express router since this is our route file

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) //get whats returned from the restaurantsctrl file, which is a list of all restaurants
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById) //get specific restaurant from specific ID, along with reviews associated with said restaurant
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines) //get list of cuisines, since we will have drop down to choose from



router //used to create reviews for the restaurants
    .route("/review")
    .post(ReviewsCtrl.apiPostReview) //post reviews method
    .put(ReviewsCtrl.apiUpdateReview) //edit reviews method
    .delete(ReviewsCtrl.apiDeleteReview) //delete reviews method

export default router 