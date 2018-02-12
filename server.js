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

app.get('/api/v1/items/:name', (request, response) => {
  const { name } = request.params;

  database('items').where('name', name).select()
    .then(item => {
      if (item.length) {
        return response.status(200).json(item[0]);
      } else {
        return response.status(404).json({ error: `No item with name ${name} found.`})
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});