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

  });

  describe('POST /api/v1/items', () => {

  });

  describe('GET /api/v1/items/:name', () => {

  });
});