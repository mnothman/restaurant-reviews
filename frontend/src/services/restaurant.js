//created this file along with the services folder, helper file to set up axios how we want and then imported into this file
import http from "../http-common";

class RestaurantDataService { //makes all the functions that make api calls and returns information from the calls
    //these uses after the http.get are they URLS that get added onto the end of the base URL in the http-common.js file!
    getAll(page = 0) {
        return http.get('restaurants?page=${page}'); //get all returns pages
    }

    get(id) {
        return http.get('/restaurant?id=${id}'); //gets ID
    }

    find(query, by = "name", page = 0) {
        return http.get('?restaurants?${by}=${query}&page=${page}'); //find takes query (cuisine, zip etc, and page number). By would be for example name or zip etc, query would be ex food or zipcode
    }

    createReview(data) {
        return http.post("/review-new", data);
    }

    updateReview(data) {
        return http.put("/review-edit", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});    }

    getCuisines(id) {
        return http.get('/cuisines');
    }
}

export default new RestaurantDataService();