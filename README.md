This project is to show how to use fac-api.js in an angular project.

Four steps :

1. npm install face-api.js
2. go the angular.json and architect>build>script tag paste this ["./node_modules/face-api.js/dist/face-api.min.js"]
   note : this has to be done in build not in test(most common mistake)
3. In app.component declare var faceapi: any;
4. Start the angular server/ Restart if already running ---> this has to be done for changes to reflect

Note : for detection to work and detect faces, proper camera should be used otherwise no result comes and a console message is generated.

The structure is the face-apiDemo folder is not tracked by the git but the build of the nagular is done in this only

so go to the master branch and build the code now change the branch to the gh-pages and copy paste the file from the internalFOlder to the outer folder
change the index.html base path to make the gitpages work
