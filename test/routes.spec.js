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
          response.body.results.length.should.equal(2);
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
  });

  describe('POST /api/v1/items', () => {

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
});