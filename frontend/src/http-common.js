//helper file for axios library that gets imported into restaurant.js

import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3000/api/v1/restaurants",
    headers: {
        "Content-type": "application/json"
    }
});