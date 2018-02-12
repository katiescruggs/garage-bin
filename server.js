const express = require('express');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log(`Garage Bin running on ${app.get('port')}`);
});

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      return response.status(200).json({ results: items });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});