// Require the client
const Clarifai = require('clarifai');

// initialize with your api key.
//We moved this from the Front end
const app = new Clarifai.App({
    apiKey: 'fa3e1f141f1f49649af4210db5d3d3dd'
   });

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImagePut = (req,res, db) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'))

}


module.exports = {
    handleImagePut: handleImagePut
}