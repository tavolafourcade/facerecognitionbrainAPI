const express = require('express');
const bodyParser = require('body-parser'); //to parse json
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//Create the app running express
const app = express();

//n order to use bodyParser middleware
//It needs to be declared after the app variable has been created
app.use(bodyParser.json());

//In order of test in our local host we need to do something called **CORS.** This is a middleware.
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'Octavio',
            password: 'cookies',
            email: 'octavio@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Ruber',
            email: 'ruber@gmail.com',
            password: 'pastry',
            entries: 0,
            joined: new Date()
        }
    ]//,
    // login: [
    //     {
    //         id: '789',
    //         has: '',
    //         email: 'octavio@gmail.com'
    //     }
    // ]
}

//Get request will return the users registered
app.get('/', (req, res) => {
    res.send(database.users);
})

// Sign In 
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json("error loggin in");
        }
    
})

// Register
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;

    //Password encryption
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });

    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            // password: password,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length-1]);
    
})

// Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            return res.json(user);
        }
    })

    if (!found){
        res.status(400).json('not found')
    }
})

app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })

    if (!found){
        res.status(400).json('not found there')
    }

})

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