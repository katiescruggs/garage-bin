const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = app.listen(app.get('port'), () => {
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

app.post('/api/v1/items', (request, response) => {
  for (let requiredParam of ['name', 'reason', 'cleanliness']) {
    if (!request.body[requiredParam]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParam}`
      });
    }
  }

  database('items').insert(request.body, 'id')
    .then(id => {
      return response.status(201).json({ id: id[0] });
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

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').where('id', id).update(request.body)
    .then(item => {
      if (item) {
        return response.status(201).json({ success: `Updated item ${id}'s ${Object.keys(request.body)}`});
      }
      else {
        return response.status(404).json({ error: `No item with id ${id} found.`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

module.exports = httpServer;
