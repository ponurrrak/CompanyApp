const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/departments', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  after(async () => {
    await Department.deleteMany();
    try {
      await mongoose.disconnect();
    } catch(err) {
      console.error(err);
    }
  });

  it('/ should insert new document to db and return success', async () => {
    const res = await request(server).post('/api/departments').send({ name: '#Department #1' });
    const newDepartment = await Department.findOne({ name: '#Department #1' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newDepartment).to.not.be.null;
  });

});
