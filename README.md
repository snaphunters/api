# Snapi

Express.js Server connected to MongoDB(mLab) hosted on Heroku.

Provides data of the articles for the Help Center stored inside the database.

## Routes

```
{
  "GET /articles": Retrieves all the articles saved inside the Draft collection
  "GET /articles/:articleTitle" : Retrieves all the information of one article given the title of one article
  "POST /articles": Insert one article into the Draft collection and into the Category collection
  "PATCH /articles/update/:articleId" : Update article inside the Draft collection given Id of one article

  "GET /publish": Retrieves all the articles saved inside the Publish collection
  "POST /publish": Insert one article into the Publish collection
  "GET /publish/:articleId": Retrieves all the information of one article given the Id of one article
  "PATCH /publish/update/:articleId": Update article inside Publish collection given Id of one article

  "GET /category": Retrieves a list of Category names from the Category collection
  "GET /category/:name": Retrieves an array of Topic Id given the name of the category

}
```

## Story wall

Click [here](https://github.com/orgs/snaphunters/projects/1) to view the story wall.

## User stories

Click [here](https://github.com/snaphunters/snapi/issues/new?assignees=&labels=user+story&template=user-story.md&title=) to create a new user story.
