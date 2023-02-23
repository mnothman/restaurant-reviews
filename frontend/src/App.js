import React from "react";
import { Switch, Route, Link } from "react-router-dom"; //using react router for our different url routes
import "bootstrap/dist/css/bootstrap.min.css"; //for style
import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-lists";
import Login from "./components/login";

//this file links to the components folder that we created, along with the 4 files inside of them

function App() {
  const [user, setUser] = React.useState(null); //user state variable using react hook

  async function login(user = null) { //dummy LOGIN SYSTEM FOR NOW, SET IT UP LATER ON MY OWN TIME
    setUser(user);
  }
  async function logout() {
    setUser(null);
  }

  return ( 
    <div>
       <nav className="navbar navbar-expand navbar-dark bg-dark">  
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}> 
                Logout {user.name}
                </a> //if there is a user, show the logout button, if no user detected, then show login button. IF ERROR SHOULD BE HERE
            ) : ( 
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
            
          </li>
        </div>
    </nav>


    <div className="container mt-3">
      <Switch> 
        <Route exact path={["/", "/restaurants"]} component={RestaurantsList}/> 
          <Route
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />
          <Route
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} /> //not sure if this is restaurants or restaurant
            )}
          />
        
          <Route
            path="/login"
            render={(props) => (
            <Login {...props} login={login} />
          )}
        />

        </Switch>
    </div>
 </div> //use a switch to swap between different routes: /, /restaurant loads restaurants, then reviews renders (used to pass in props and user), and restaurant ID route, login route for login component
  );
}

export default App;

