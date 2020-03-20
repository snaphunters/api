# Snapi

Express.js Server connected to MongoDB(mLab) hosted on Heroku.
Provides data of the articles for the Help Center stored inside the database.

## Routes

```
{
  "GET /articles": Retrieves all the articles saved inside the Drafts collections
  "GET /articles/:articleTitle" : Retrieves all the information of one article given the title of one article
  "POST /articles": Insert one article into the Drafts collection and into the Category collection
}
```

## Story wall

Click [here](https://github.com/orgs/snaphunters/projects/1) to view the story wall.

## User stories

Click [here](https://github.com/snaphunters/snapi/issues/new?assignees=&labels=user+story&template=user-story.md&title=) to create a new user story.
