const handleRegister = (req, res, db, bcrypt) => {
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

}

module.exports = {
    handleRegister: handleRegister
}