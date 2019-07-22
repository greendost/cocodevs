# Cocodevs

Public Code Collaboration Listing

## About

Project from React Hackathon, 7/20/2019

Team members: Matt, Swati, Jagdish, Harteg

This project's goal is to provide a public listing where developers can post a request for help &ndash;  e.g. to get unstuck with their project, request a code review, etc. &ndash;  by including a helpful description and a url (e.g. VS Code liveshare, codesandbox, etc.).  Expert developers can come to the site, browse or search listings, and click on the title of a given listing to open up a connection to the developer's session.

## Technologies

React, Bootstrap, Node, Express, Sqlite

## Steps To run

1. clone repo

2. make sure to have [sqlite3](https://www.sqlite.org/download.html) and nodemon installed

   sqlite  
   Mac: if not installed, use `brew`  
   Windows: consult sqlite downloads page

   nodemon  
   `npm i -g nodemon`

3. setup database with `npm run build-db`

4. Launch app, which is set to run on port 3001.  
   `npm run dev`
