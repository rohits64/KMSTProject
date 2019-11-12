import React, { Component } from "react";
import "./Search.css";

class Search extends Component {
  state = {
    searchValue: "",
    meals: [],
    flag: ""
  };

  handleOnChange = event => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearch = () => {
    this.makeApiCall("food",this.state.searchValue);
  };

  handleSearchTour = () => {
    this.makeApiCall("tour", this.state.searchValue);
  }

  makeApiCall = (type, searchInput) => {
    var searchUrl;
    if (type === "food") {
    searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;}
    else { searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT+%3Fname+%3Fimage++where+%7B%0D%0A++++%3Falpha+dct%3Asubject+dbc%3A${searchInput}.%0D%0A++++%3Falpha+rdfs%3Alabel+%3Fname+.%0D%0A++++%3Falpha+foaf%3Adepiction+%3Fimage%0D%0A++++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A%0D%0A++++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`}
    fetch(searchUrl)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        if (type === "food") {
          this.state.places ? (delete this.state.places) : console.log("meals deleted");
         this.setState({ cuisines: jsonData.meals });
         delete this.state.meals;
 created_radio_button
        }
        else {
          this.state.cuisines ? (delete this.state.cuisines) : console.log("places deleted");
          this.setState({ places: jsonData.results.bindings });
          delete this.state.meals;
        }

 master
        console.log(this.state);
      });
  };

  render(){
    return (
      <div id="main">
        <h1>Welcome</h1>
        <input
          name="text"
          type="text"
          placeholder="Search"
          onChange={event => this.handleOnChange(event)}
          value={this.state.searchValue}
        />
        <button onClick={this.handleSearch}>Cuisine</button>
        <button onClick={this.handleSearchTour}>Tourist Places</button>
        {this.state.cuisines ? (
          <div id="cuisine-container">
            {this.state.cuisines.map((cuisine, index) => (
              <div class="single-cuisine" key={index}>
                <h2>{cuisine.strMeal}</h2>
                <img src={cuisine.strMealThumb} alt="cuisine thumbnail not available!" />
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        {this.state.places ? (
          <div id="cuisine-container">
            {this.state.places.map((place, index) => (
              <div class="single-cuisine" key={index}>
                <h2>{place.name.value}</h2>
                <img src={place.image.value} alt="place thumbnail not available!" />
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        {(!this.state.places && !this.state.cuisines) ? (<p>You haven't searched anything!</p>) : (<p></p>)};
      </div>
    );
  }
}

export default Search;
