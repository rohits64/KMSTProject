# KMST Project

This project was made as a part of the course Knowledge Modelling and Semantic Technologies.

This is a simple React JS application that illustrates how to perform a search. In this application, I query one of the DBPedia APIs that returns an array of objects which we display.

### Features
- Various locations inside and outside of India.
- Support for Cuisines, Historic sites and Tourist attractions.
- Uses multiple datasets.
  - DBpedia
  - WikiData
  - MealDB and Wikipedia for linked images.
- Sterling input query searching procedure covering for the absence of data linking.
- Retrieving the coordinates of the locations and linking to google maps location.
- SPARQL Query generation and querying on the client-side for faster retrieval.
- Retrieves and unfurls the linked images from MealDB and Wikipedia for better UI.
- Easy to run, setup and deploy.
  - Deployed on Heroku - https://calm-waters-88173.herokuapp.com/


### Future Scope
- Intelligently suggesting places, based on the user’s location and other past information.
- Better UI and design.
- Supporting for more places, for example, USA state-wise and megacities of the world.

## To install and run project locally

```
$ git clone https://github.com/rohitsanjay/KMSTProject
$ cd KMSTProject
$ npm install
$ npm start
```
