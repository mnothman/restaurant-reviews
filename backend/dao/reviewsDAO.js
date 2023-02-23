import mongodb from "mongodb" //get access to object id, convert string to mongodb object id
const ObjectId = mongodb.ObjectId

let reviews //empty variable for now, fill with reference to reviews collection

export default class ReviewsDAO{
    static async injectDB(conn) {
        if (reviews) { //if reviews already exist, just return
            return
        }
        try { //if not, access database and then the reviews collection, mongodb is nice since if the collection we are trying to get doesn't exist, it will create it
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("review successful")
        } catch (e) {
            console.error('Unable to establish collection handles in userDAO: ${e}')
        }
    }

    static async addReview(restaurantId, user, review, date) { //add review takes restaurant id, user, review text and date
        try {
            const reviewDoc = { name: user.name, //create this review document, with an object id and then insert into database
                user_id: user._id,
                date: date,
                text: review,
                restaurantId: ObjectId(restaurantId), } //restaurant ID gets converted to mongodb object id

            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error('Unable to post review: ${e}')
            return { error: e }
        } 
    }

    static async updateReview(reviewId, userId, text, date) { //take review id, user id, text and date
        try {
            const updateResponse = await reviews.updateOne( 
                { user_id: userId, _id: ObjectId(reviewId) }, //look for review that has the correct review and user id
                { $set: { text: text, date: date }}, //set new text and date 
            )

        
            return updateResponse //then return updated response or error
        } catch (e) {
            console.error('Unable to update review: ${e}')
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({  //look for review that has the user id and review id 
                _id : ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse //then return deleted response or error
        } catch (e) {
            console.error('Unable to delete review: ${e}')
            return { error: e }
        }
    }
}
