const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments/:id', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
      const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: '#Department #1' });
      await testDepOne.save();
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

  it('/ should return chosen document and delete it in db', async () => {
    const res = await request(server).delete('/api/departments/5d9f1140f10a81216cfd4408');
    const departmentRemoved = await Department.findById('5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body._id).to.be.equal('5d9f1140f10a81216cfd4408');
    expect(res.body.name).to.be.equal('#Department #1');
    expect(departmentRemoved).to.be.null;
  });

});
