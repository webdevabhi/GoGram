Below you will find some information on how to perform common tasks.<br>

To run the Application follow the steps below:
1. Clone or download the source code.
2. cd `FOLDER_NAME`
3. npm install
4. create `environment.js` file inside `server -> config` folder
4. create `uploads/images` folder inside `server` folder
4. npm run dev


# Folder Structure

After creation, your project should look like this:

```
GoGram/
  documents/
  node_modules/
  server/
    api/
      auth_controller.js
      index.js
      post_comment_controller.js
      post_like_controller.js
      user_controller.js
    config/
      environment.js
    models/
      post_comment_model.js
      post_like_model.js
      post_model.js
      user_model.js
    uploads/
      images/
        <- All uploaded images will come here ->
    app.js
    express_middlewares.js
    index.js
    routes.js
    utility.js
  package.json
  README.md
```

# Environment.js File Structure

```js
module.exports = {
  port: process.env.PORT || 5000,

  jwtKey: 'ANY-STRING-TO-GENERATE-JWT',

  mongo: {
    uri: "mongodb://localhost:27017/{ MONGODB_NAME }"
  }
};
```

# Available Scripts

In the project directory, you can run:

### npm start

It will create a express server with post `5000`.


### npm run dev

It will create a express server with post `5000`.
whenever changes detected it automatically restart the server.

# Note :

For creating collection in mongodb, mongoose will check the required collection exists on not, if it does not exist then it creates it.

`*** Please do not forgot to create the required files and folder.`


# Something Missing?

If you have ideas for more “How To” recipes that should be on this page, [let us know](https://github.com/webdevabhi/GoGram/issues)