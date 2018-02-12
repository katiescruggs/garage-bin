process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should('should');
const chaiHttp = require('chai-http');
const server = require('../server');

const knex = require('../db/knex');

chai.use(chaiHttp);