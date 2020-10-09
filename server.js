const express = require('express');
const bodyParser = require('body-parser'); //to parse json
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//Initializing the database
//this is a function that's running knex const automatically
const knex = require('knex');

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
app.post('/signin', (req, res) => {
    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //         res.json(database.users[0]);
    //     } else {
    //         res.status(400).json("error loggin in");
    //     }
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid){
            return db.select('*').from('users')
            .where('email','=', req.body.email)
            .then(user => {
                // console.log(user);
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }else{
            res.status(400).json('wrong credentials')
        }
        
    })
    .catch(err => res.status(400).json('wrong credentials'))
    
})

// Register
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;

    
    //Password encryption
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    //Implementing the password encryption with DB
    const hash = bcrypt.hashSync(password);

    //We create a transaction in order to update both Register and Login
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            //Using Knex\
            return trx('users')
            .returning('*') //users insert raul and return all columns
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
            res.json(user[0]); 
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    //Now we're going to use knex instead of the local DB
    // database.users.push(
    //     {
    //         id: '125',
    //         name: name,
    //         email: email,
    //         // password: password,
    //         entries: 0,
    //         joined: new Date()
    //     }
    // )

 
    .catch(err => res.status(400).json('unable to register'));

})

// Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //let found = false;
    //Using knex
    // database.users.forEach(user => {
    //     if (user.id === id){
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length){
            res.json(user[0]);
        }
        
    })
    .catch(err => res.status(400).json('Not found'))

    // if (!found){
    //     res.status(400).json('not found')
    // }
})

//The image endpoint updates the entries and it increases the count
app.put('/image',(req,res) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'))

})

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