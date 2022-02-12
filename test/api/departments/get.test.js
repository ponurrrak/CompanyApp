const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/departments', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
      const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
      await testDepOne.save();
      const testDepTwo = new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
      await testDepTwo.save();
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

  it('/ should return all departments', async () => {
    const res = await request(server).get('/api/departments');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('/:id should return one department by :id ', async () => {
    const res = await request(server).get('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.name).to.be.equal('Department #1');
  });

  it('/random should return one random department', async () => {
    const res = await request(server).get('/api/departments/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.name).to.be.oneOf(['Department #1', 'Department #2']);
  });

});
