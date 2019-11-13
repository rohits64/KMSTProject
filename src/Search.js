import React, { Component } from "react";
import "./Search.css";

function arrUnique(arr) {
  var cleaned = [];
  arr.forEach(function(itm) {
      var unique = true;
      cleaned.forEach(function(itm2) {
          if(itm.name.value === itm2.name.value)
          {
            unique = false;
          }
      });
      if(unique)
      {
        cleaned.push(itm);
      }
  });
  return cleaned;
}

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
  };

  makeApiCall = (type, searchInput) => {
    var searchUrl;
    if (type === "food")
    {
      searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT+%3Fname+%3Fimage++where+%7B%0D%0A++++%3Falpha+dct%3Asubject+dbc%3A${searchInput}.%0D%0A++++%3Falpha+rdfs%3Alabel+%3Fname+.%0D%0A++++%3Falpha+foaf%3Adepiction+%3Fimage%0D%0A++++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A%0D%0A++++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
    }
    else
    {
      searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT++%3Fname+%3Fimage+where+%7B%0D%0A+++%3Fbeta+++skos%3Abroader+dbc%3ATourist_attractions_by_country.%0D%0A++++%3Fgamma++skos%3Abroader+%3Fbeta+.%0D%0A+++%3Fdelta++dct%3Asubject+%3Fgamma++.%0D%0A++++%3Fdelta+dbo%3Alocation+dbr%3A${searchInput}+.%0D%0A+++%3Fdelta+foaf%3Aname+%3Fname+.%0D%0A++OPTIONAL+%7B+%3Fdelta+foaf%3Adepiction+%3Fimage+%7D%0D%0A+++%0D%0A+++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A++++%0D%0A+++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
      //searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT+%3Fdelta+%3Fbeta+%3Fgamma+%3Fname+where+%7B%0D%0A+++%3Fbeta+++skos%3Abroader+dbc%3ATourist_attractions_by_country++.%0D%0A++++%3Fgamma++skos%3Abroader+%3Fbeta+.%0D%0A+++%3Fdelta++dct%3Asubject+%3Fgamma++.%0D%0A++++%3Fdelta+dbo%3Alocation+dbr%3A${searchInput}+.%0D%0A+++%3Fdelta+foaf%3Aname+%3Fname%0D%0A+++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A++++%0D%0A+++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
    }
    fetch(searchUrl)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        if (type === "food") {
          this.setState({ cuisines: jsonData.results.bindings });
          if(this.state.place)
          {
            delete this.state.place;
            console.log('Done deleting the fucking places!!!!');
          }
        }
        else
        {
          if(this.state.cuisines)
          {
            delete this.state.cuisines;
            console.log('Done deleting the fucking cuisines!!!!!');
          }
          this.setState({ places: arrUnique(jsonData.results.bindings) });
        }
        console.log(this.state);
      });
  };

  render(){
    return (
      <div id="main">
        <h1>Welcome bastards!</h1>
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
              <div className="single-cuisine" key={index}>
                <h2>{cuisine.name.value}</h2>
                <img src={cuisine.image.value} alt="Oh jeez not available!" />
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        {this.state.places ? (
          <div id="cuisine-container">
            {this.state.places.map((place, index) => (
              <div className="single-cuisine" key={index}>
                <h2>{place.name.value}</h2>
                <img src={place.image.value} alt="place thumbnail not available!" />
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
        {(!this.state.places && !this.state.cuisines) ? (<p>You haven't searched anything!</p>) : (<p></p>)}
      </div>
    );
  }
}

export default Search;
