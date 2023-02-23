import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = props => { //use react hooks to create these state variables
  const [restaurants, setRestaurants] = useState([]); //set as empty array
  const [searchName, setSearchName] = useState([""]); 
  const [searchZip, setSearchZip] = useState([""]);
  const [searchCuisine, setSearchCuisine] = useState([""]);
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  //keeps tracks of searches above


  useEffect(() => {
    retrieveRestaurants(); //this is how you tell react to do something after rendering
    retrieveCuisines(); //in this instance it retrieves restaurants and cuisines from functions below
  }, []);
  

  //these three functions below allow for searching for name, zipcode or cuisine
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };
  
  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };
  
  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
  };

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll() 
      .then(response => { 
        console.log(response.data); //logs data then sets restaurants, goes into restaurants state above
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      })
  };

  const retrieveCuisines = () => { //same as above, use restaurant data service to log and then set state variable 
    RestaurantDataService.getCuisines()
      .then(response => { 
        console.log(response.data); 
        setCuisines(["All Cuisines"].concat(response.data));
    })
    .catch(e => {
      console.log(e);
    })
};

  const refreshList = () => {
    retrieveRestaurants(); //if searching for all cuisines, use refresh to just return all restaurants
  };



  const find = (query, by) => { 
    RestaurantDataService.find(query,by) //after we find the data (using function from restaurant.js), we log data and set restaurants as data that gets returned
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //once button is clicked, pass in ____ and then the word "____", these 3 below go into the find function above
  const findByName = () => {
    find(searchName, "name")
  };

  const findByZip = () => {
    find(searchZip, "zipcode")
  };

  const findByCuisine = () => {
    if (searchCuisine === "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine")
    }
  };  

  return ( //heavy use of bootstrap to help style. will have 3 ways to search: with name in an input box, zipcode, or dropdown menu for cuisines.
    <div className="row pb-1">
     <div className="input-group col-lg-4"> 
      <input //search by name using input box
        type="text"
        className="form-control"
        placeholder="Search by name"
        value={searchName}
        onChange={onChangeSearchName}
        />
        <div className="input-group-append">
          <button 
            className="btn btn-outline-secondary"
            type="button"
            onClick={findByName}
            >
              Search
            </button>

        </div>
     </div>

    <div className="input-group col-lg-4">
      <input //searches by zipcode instead of name above
        type="text" 
        className="form-control"
        placeholder="Search by zip"
        value={searchZip}
        onChange={onChangeSearchZip}
        />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={findByZip}
        >
          Search
        </button>
      </div>
    </div>

  <div className="input-group col-lg-4"> 
    <select onChange={onChangeSearchCuisine}> 
      {cuisines.map(cuisine => { //use this map function, for each cuisine in that array, return array for that select box
        return(
          <option value={cuisine}> {cuisine.substring(0,20)} </option> //set cuisine to the cuisine customer selects, 21 character limit
        )
      })}
    </select> 

    <div className="input-group-append">
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={findByCuisine} //click button that finds by cuisine
      >
        Search 
        </button> 
    </div>
  </div> 

  <div className="row"> 
    {restaurants.map((restaurant) => { //map thru restaurants array
      const address = '${restaurant.address.building}, ${restaurant.address.street}, ${restaurant.address.zipcode}'; //for each restaurant, first get address
      return (
        <div className="col-lg-4 pb-1">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{restaurant.name}</h5>
              <p className="card-text">
                <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                <strong>Address: </strong>{address}
              </p>
              <div className="row">
                <Link to={"/restaurants/" +restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                  Video Reviews
                </Link>
                <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                </div>
              </div>
            </div>
          </div>
      );
      })}

    </div>
  </div>
 //1:38:35 ERROR SHOWING ALL LIST OF RESTAURANTS, run using npm start. SOMETHING IS WRONG ON THIS FILE

  );
};

export default RestaurantsList;


