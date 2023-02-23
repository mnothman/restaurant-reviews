import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController { //reviews controller class with 3 methods: post review, update review, delete review
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id //get info from body of request: restaunt id, text of the review, name and user id of body
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }
            const date = new Date () //get a new date and then put this all together below 

            const reviewResponse = await ReviewsDAO.addReview( //sends this below info to reviews dao
                restaurantId,
                userInfo,
                review,
                date,
            )
            res.json({ status: "success" }) //return success if worked
        } catch (e) {
            res.status(500).json({ error: e.message }) //return error if didn't work
        }
    }

    static async apiUpdateReview(req, res, next) { //update review, get review_id, user_id and text we are going to update, and get a new date as well
        try {
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date ()

            const reviewResponse = await ReviewsDAO.apiUpdateReview( //send it over
                reviewId,
                req.body.user_id, //get user_id to ensure that the user who created the review is the same one trying to update the review
                text,
                date,
            )

            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error }) //check if error
            }

            if (reviewResponse.modifiedCount === 0) { //review was not updated, and then throw error
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }
            res.json({ status: "success" }) //return success if worked
        } catch (e) {
            res.status(500).json({ error: e.message }) //return error if didn't work
        }
    }
        
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id //id to be deleted
            const userId = req.body.user_id //this is NOT standard to have anything in body but keep it for this example, not for production env
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.deleteReview( //call delete review and if success / error
                reviewId,
                userId,
                )
                res.json({ status: "success" }) //return success if worked
            } catch (e) {
             res.status(500).json({ error: e.message }) //return error if didn't work
        }
    }
}



