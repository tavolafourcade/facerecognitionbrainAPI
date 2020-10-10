const express = require('express');
const bodyParser = require('body-parser'); //to parse json
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


//Importing controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profileGet = require('./controllers/profile');
const image = require('./controllers/image');
//Initializing the database
//this is a function that's running knex const automatically
const knex = require('knex');
const profile = require('./controllers/profile');
const db = knex({
    client: 'pg',//the client is postgress (pg)
    connection: {
      host : '127.0.0.1', //this means localhost
      user : 'postgres',
      password: '123',
      database : 'smart-brain'
    }
  });

db.select('*').from('users').then(data =>{
    // console.log(data);
});
//Create the app running express
const app = express();

//n order to use bodyParser middleware
//It needs to be declared after the app variable has been created
app.use(bodyParser.json());

//In order of test in our local host we need to do something called **CORS.** This is a middleware.
app.use(cors());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'Octavio',
//             password: 'cookies',
//             email: 'octavio@gmail.com',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Ruber',
//             email: 'ruber@gmail.com',
//             password: 'pastry',
//             entries: 0,
//             joined: new Date()
//         }
//     ]//,
//     // login: [
//     //     {
//     //         id: '789',
//     //         has: '',
//     //         email: 'octavio@gmail.com'
//     //     }
//     // ]
// }

//Get request will return the users registered
app.get('/', (req, res) => {
    res.send(database.users);
})

// Sign In 
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// Register
//Dependency injection: were injecting db and bcrypt into the register function
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

// Profile
app.get('/profile/:id', (req, res) => {profileGet.handleProfileGet(req, res, db)})

//The image endpoint updates the entries and it increases the count
app.put('/image', (req, res) => {image.handleImagePut(req, res, db)})

    //Since were using Knex, we don't need this anymore
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // })

    // if (!found){
    //     res.status(400).json('not found there')
    // }

//In order to send the API key from the Back-end to the Front-end
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})


//We're using the port 3000 to listen
app.listen(3000, () => {
    console.log('app is running on port 3000');
})


/*
To test use: npm start
*/
/*
API design
signin   --> POST = success/fail    (We're posting some data like password)
register --> POST =   user object (We want to add data to the DB)
/profile/: userId --> GET = user    (each user has it own home screen)
/image --> PUT --> user  (we're updating the score of the user)
*/