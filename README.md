# Snapi

Express.js Server connected to MongoDB(mLab) hosted on Heroku.

Provides data of the articles for the Help Center stored inside the database.

### Package used :
express: version 4.17.1

mongoose: version 5.9.2 


## Routes

```
{
  //Article Route
  "GET /articles": Retrieves all the articles saved inside the Draft collection
  "GET /articles/:articleTitle" : Retrieves all the information of one article given the title of one article
  "POST /articles": Insert one article into the Draft collection and into the Category collection
  "PATCH /articles/update/:articleId" : Update article inside the Draft collection given Id of one article
  "DELETE /articles/:articleId" : Delete article inside the Draft collection given Id of one article

  //Publish Route
  "GET /publish": Retrieves all the articles saved inside the Publish collection
  "POST /publish": Insert one article into the Publish collection
  "GET /publish/:articleId": Retrieves all the information of one article given the Id of one article
  "PATCH /publish/update/:articleId": Update article inside Publish collection given Id of one article

  //Category Route
  "GET /category": Retrieves a list of Category names from the Category collection
  "GET /category/:name": Retrieves an array of Topic Id given the name of the category

}
```

## Story wall

Click [here](https://github.com/orgs/snaphunters/projects/1) to view the story wall.
