import React, { Component } from "react";
import "./Search.css";
// import Map from "./Map.js";

var stringSimilarity = require('string-similarity');
var bestmatch;
var bestmatch_cuisine;
var glat,glong;
var url;

function score_strings(a, b){
  a = a.trim();
  b = b.trim();
  var a_lowered = a.toLowerCase();
  var b_lowered = b.toLowerCase();
  var common_substring = longestCommonSubstring(a_lowered, b_lowered);
  var score_a = common_substring.length / a_lowered.length;
  var score_b = common_substring.length / b_lowered.length;
  var scorrrrr;
  // console.log(score_a);
  // console.log(score_b);
  
  if (a.length < b.length)
    scorrrrr = score_a;
  else
    scorrrrr = score_b;
 
  // if (score_a > 0.8) {
  //   scorrrrr = 1;
  // }
  // if (score_b > 0.8) {
  //   scorrrrr = 1;
  // }

  var splitted_a = a.split(" ");
  if (splitted_a.length > 1){
    return Math.max(Math.max(scorrrrr, score_strings(splitted_a[0], b)), score_strings(splitted_a[1], b));
  }
  else {
    return scorrrrr;
  }
}

function longestCommonSubstring(string1, string2) {
  // Convert strings to arrays to treat unicode symbols length correctly.
  // For example:
  // '𐌵'.length === 2
  // [...'𐌵'].length === 1
  const s1 = [...string1];
  const s2 = [...string2];

  // Init the matrix of all substring lengths to use Dynamic Programming approach.
  const substringMatrix = Array(s2.length + 1).fill(null).map(() => {
    return Array(s1.length + 1).fill(null);
  });

  // Fill the first row and first column with zeros to provide initial values.
  for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
    substringMatrix[0][columnIndex] = 0;
  }

  for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
    substringMatrix[rowIndex][0] = 0;
  }

  // Build the matrix of all substring lengths to use Dynamic Programming approach.
  let longestSubstringLength = 0;
  let longestSubstringColumn = 0;
  let longestSubstringRow = 0;

  for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
      if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
        substringMatrix[rowIndex][columnIndex] = substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
      } else {
        substringMatrix[rowIndex][columnIndex] = 0;
      }

      // Try to find the biggest length of all common substring lengths
      // and to memorize its last character position (indices)
      if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
        longestSubstringLength = substringMatrix[rowIndex][columnIndex];
        longestSubstringColumn = columnIndex;
        longestSubstringRow = rowIndex;
      }
    }
  }

  if (longestSubstringLength === 0) {
    // Longest common substring has not been found.
    return '';
  }

  // Detect the longest substring from the matrix.
  let longestSubstring = '';

  while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
    longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
    longestSubstringRow -= 1;
    longestSubstringColumn -= 1;
  }

  return longestSubstring;
}

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
    this.find_required_string(event.target.value);
    this.setState({ searchValue: event.target.value });
  };

  handleSearch = () => {
    this.makeApiCall("food",bestmatch_cuisine);
  };

  handleSearchTour = () => {
    this.makeApiCall("tour", bestmatch);
  };
  find_required_string = (searchInput) =>{
    var tourist_location_array = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT++DISTINCT+%3Fname+%3Flat+%3Flong+where+%7B%0D%0A+++%0D%0A++++%3Fgamma++skos%3Abroader++dbc%3ATourist_attractions_in_India+.%0D%0A+++%3Fdelta++dct%3Asubject+%3Fgamma++.%0D%0A++++%3Fdelta+dbo%3Alocation+%3Ftheta+.%0D%0A++++%3Ftheta+rdfs%3Alabel+%3Fname%0D%0A++++OPTIONAL+%7B+%3Ftheta+geo%3Alat+%3Flat+%7D%0D%0A++++OPTIONAL+%7B+%3Ftheta+geo%3Along+%3Flong+%7D%0D%0AFILTER+%28lang%28%3Fname%29+%3D+%27en%27%29++%0D%0A%0D%0A%7D%0D%0ALIMIT+10000&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
    var cuisine_array = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fname+++where+%7B%0D%0A++++%3Falpha+skos%3Abroader++dbc%3AIndian_cuisine_by_state_or_territory+.++%0D%0A++++%3Falpha+rdfs%3Alabel+%3Fname+.++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
    // GAwd link hai upar wala, dbpedia sponsored query of ROHITSANJAY!!!!
    fetch(tourist_location_array)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        var result_array = jsonData.results.bindings;
        var tourist_names = [];
        console.log(jsonData.results.bindings);
        for(let index = 0;index < result_array.length; index++)
        {
          tourist_names[index] = result_array[index].name.value;
        }
        var matches = stringSimilarity.findBestMatch(searchInput, tourist_names);
        // matches is an json object
        console.log(matches);
        // res = str.replace(/ /g, "_")
        bestmatch = matches.bestMatch.target;
        if(typeof result_array[matches.bestMatchIndex].lat !== "undefined")
        {
          glat = result_array[matches.bestMatchIndex].lat.value;
          glong = result_array[matches.bestMatchIndex].long.value;
          url = "https://maps.google.com/?q=" + glat + "," + glong;
        }
        else
        {
          url = undefined;
        }
      });
    fetch(cuisine_array)
      .then(response =>{
        return response.json();
      })
      .then(jsonData => {
        var result_array = jsonData.results.bindings;
        var cuisine_names = [];
        console.log(jsonData.results.bindings);
        for(let index = 0;index < result_array.length; index++)
        {
          cuisine_names[index] = result_array[index].name.value;
        }
        var matches = stringSimilarity.findBestMatch(searchInput, cuisine_names);
        // matches is an json object
        // console.log(matches.bestMatch.target);
        // res = str.replace(/ /g, "_")
        bestmatch_cuisine = matches.bestMatch.target;
        // console.log('Cuisine', bestmatch_cuisine)
      });
  };
  makeApiCall = (type, searchInput) => {
    var searchUrl;
    console.log(searchInput);
    var modified_search_input = searchInput.replace(/ /g, "_");
    if (type === "food")
    {
      searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT+%3Fname+%3Fimage++where+%7B%0D%0A++++%3Falpha+dct%3Asubject+dbc%3A${modified_search_input}.%0D%0A++++%3Falpha+rdfs%3Alabel+%3Fname+.%0D%0A++++%3Falpha+foaf%3Adepiction+%3Fimage%0D%0A++++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A%0D%0A++++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
    }
    else
    {
      searchUrl = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0A%0D%0ASELECT++%3Fname+%3Fimage+where+%7B%0D%0A+++%3Fbeta+++skos%3Abroader+dbc%3ATourist_attractions_by_country.%0D%0A++++%3Fgamma++skos%3Abroader+%3Fbeta+.%0D%0A+++%3Fdelta++dct%3Asubject+%3Fgamma++.%0D%0A++++%3Fdelta+dbo%3Alocation+dbr%3A${modified_search_input}+.%0D%0A+++%3Fdelta+foaf%3Aname+%3Fname+.%0D%0A++OPTIONAL+%7B+%3Fdelta+foaf%3Adepiction+%3Fimage+%7D%0D%0A+++%0D%0A+++FILTER+%28lang%28%3Fname%29+%3D+%27en%27%29%0D%0A++++%0D%0A+++%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`;
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
        console.log('State is',this.state);
        score_strings('pla','nab');
      });
  };

  render(){
    return (
      <div id="main">
        <h1>Welcome TOURISTS!</h1>
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
          <div><h2>{bestmatch_cuisine}</h2>
          <div id="cuisine-container">
            {this.state.cuisines.map((cuisine, index) => (
              <div className="single-cuisine" key={index}>
                <h2>{cuisine.name.value}</h2>
                <img src={cuisine.image.value} alt="Oh jeez not available!" />
              </div>
            ))}
          </div></div>
        ) : (
          <p></p>
        )}
        {this.state.places ? (
          <div><h2>{bestmatch}</h2>
          {(url !== undefined) ? (<a href = {url} target="_blank" rel="noopener noreferrer">Show map</a>):(<p></p>)}
          <div id="cuisine-container">
            {this.state.places.map((place, index) => (
              <div className="single-cuisine" key={index}>
                {(typeof place.name != "undefined") ? (
                <h2>{place.name.value}</h2>): (<p></p>)}
                {(typeof place.image != "undefined") ? (
                  <img src={place.image.value} alt="place thumbnail not available!" />
                ): (<img alt="place thumbnail not available!" />)}
                {/* {(place.lat && place.long) ? (<Map/>):(<p></p>)} */}
              </div>
            ))}
          </div></div>
        ) : (
          <p></p>
        )}
        {(!this.state.places && !this.state.cuisines) ? (<p>You haven't searched anything!</p>) : (<p></p>)}
      </div>
    );
  }
}

export default Search;
