const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
    handleProfileGet: handleProfileGet
}
