# Recharge Portal

A small app to use as a mobile recharge portal, with Angular JS and CDN Bootstrap on the front 
end and Express + Node at the backend. Database used is MongoDB, currently using MongoLab.

Database Connection can be configured using config/index.js file.
Requires a few collections namely: users, phones, providers and transactions.


## How to use 

Clone the repository, run `npm install` to grab the dependencies.
Configure the MongoDB/MongoLab connection by editing the /config/index.js file.

### Running the app

Runs like a typical express app:

    node app.js

### Running tests

Coming soon!

### Receiving updates from upstream

Just fetch the changes and merge them into your project with git.



## Contact

For more information on AngularJS please check out http://angularjs.org/
For more on Express and Jade, http://expressjs.com/ and http://jade-lang.com/ are
your friends.

## License
MIT
