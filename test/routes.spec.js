process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should('should');
const chaiHttp = require('chai-http');
const server = require('../server');

const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      })
  });

  it('should return 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/doesnotexist')
      .then(response => {
        throw response;
      })
      .catch(error => {
        error.should.have.status(404);
      })
  })
});

describe('API Routes', () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => done());
  });

  describe('GET /api/v1/items', () => {
    it('should return all of the items', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.results.should.be.a('array');
          response.body.results[0].should.have.property('id');
          response.body.results[0].should.have.property('name');
          response.body.results[0].should.have.property('reason');
          response.body.results[0].should.have.property('cleanliness');
          response.body.results[0].should.have.property('created_at');
          response.body.results[0].should.have.property('updated_at');
        })
        .catch(error => {
          throw error;
        })
    });

    it('should return 404 if the URL is mistyped', () => {
      return chai.request(server)
        .get('/api/v1/item')
        .then(response => {
          throw response;
        })
        .catch(error => {
          error.should.have.status(404);
        })
    });
  });

  describe('POST /api/v1/items', () => {
    it('should return the id of the new item', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'New Item',
          reason: 'Why Not?',
          cleanliness: 'Rancid'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
        })
        .catch(error => {
          throw error;
        })
    });

    it('should return error message if name is missing from request body', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          reason: 'Why Not?',
          cleanliness: 'Rancid'
        })
        .then(response => {
          throw response
        })
        .catch(error => {
          error.should.have.status(422);
          error.response.should.be.json;
          error.response.body.should.be.a('object');
          error.response.body.should.have.property('error');
          error.response.body.error.should.equal('You are missing the required parameter name');
        })
    });

    it('should return error message if reason is missing from request body', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'New Item',
          cleanliness: 'Rancid'
        })
        .then(response => {
          throw response
        })
        .catch(error => {
          error.should.have.status(422);
          error.response.should.be.json;
          error.response.body.should.be.a('object');
          error.response.body.should.have.property('error');
          error.response.body.error.should.equal('You are missing the required parameter reason');
        })
    });

    it('should return error message if cleanliness is missing from request body', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'New Item',
          reason: 'Why Not?'
        })
        .then(response => {
          throw response
        })
        .catch(error => {
          error.should.have.status(422);
          error.response.should.be.json;
          error.response.body.should.be.a('object');
          error.response.body.should.have.property('error');
          error.response.body.error.should.equal('You are missing the required parameter cleanliness');
        })
    });

    it('should return 404 if the URL is mistyped', () => {
      return chai.request(server)
        .post('/api/v1/item')
        .send({
          name: 'New Item',
          reason: 'Why Not?',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          throw response;
        })
        .catch(error => {
          error.should.have.status(404);
        })
    });
  });

  describe('GET /api/v1/items/:name', () => {
    it('should return one item with name that matches request param', () => {
      return chai.request(server)
        .get('/api/v1/items/dresser')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.should.have.property('reason');
          response.body.should.have.property('cleanliness');
          response.body.should.have.property('created_at');
          response.body.should.have.property('updated_at');
        })
        .catch(error => {
          throw error;
        })
    });

    it('should provide error message if item does not exist', () => {
      return chai.request(server)
        .get('/api/v1/items/doesnotexist')
        .then(response => {
          throw response;
        })
        .catch(error => {
          error.should.have.status(404);
          error.response.should.be.json;
          error.response.body.should.be.a('object');
          error.response.body.should.have.property('error');
          error.response.body.error.should.equal('No item with name doesnotexist found.');
        })
    });

    it('should return 404 if URL is mistyped', () => {
      return chai.request(server)
        .get('/api/v1/item/dresser')
        .then(response => {
          throw response;
        })
        .catch(error => {
          error.should.have.status(404);
        })
    });
  });

  describe('PATCH /api/v1/items/:id', () => {
    it('should return a success message if the patch went through (cleanliness)', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'New Item',
          reason: 'To be patched',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          return response.body.id
        })
        .then(id => {
          return chai.request(server)
            .patch(`/api/v1/items/${id}`)
            .send({
              cleanliness: 'Rancid'
            })
            .then(response => {
              response.should.have.status(201);
              response.body.should.be.a('object');
              response.body.success.should.equal(`Updated item ${id}'s cleanliness`);
            })
            .catch(error => {
              throw error;
            })
        })
        .catch(error => {
          throw error;
        })
    });

    it('should return a success message if the patch went through (name)', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'New Item',
          reason: 'To be patched',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          return response.body.id
        })
        .then(id => {
          return chai.request(server)
            .patch(`/api/v1/items/${id}`)
            .send({
              name: 'Old Item'
            })
            .then(response => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.success.should.equal(`Updated item ${id}'s name`);
            })
            .catch(error => {
              throw error;
            })
        })
        .catch(error => {
          throw error;
        })
    });

    it('should return an error message if item does not exist', () => {
      return chai.request(server)
        .patch('/api/v1/items/10000000')
        .send({
          name: 'New Item',
          reason: 'To be patched',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          throw response;
        })
        .catch(error => {
          error.should.have.status(404);
          error.response.should.be.json;
          error.response.body.should.be.a('object');
          error.response.body.error.should.equal('No item with id 10000000 found.');
        })
    });
  });
});