const mongoose = require('mongoose');
const expect = require('chai').expect;
const Employee = require('../employee.model');
const Department = require('../department.model');

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const department = new Department({ name: 'Department #1' });
      await department.save();
      const departmentId = (await Department.findOne({ name: 'Department #1' }))._id;
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: departmentId,
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Foo',
        lastName: 'Bar',
        department: departmentId,
      });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(2);
    });

    it('should return a proper document by various params with "findOne" method', async () => {
      const employeeOne = await Employee.findOne({ firstName: 'John' });
      const employeeTwo = await Employee.findOne({ lastName: 'Doe' });
      expect(employeeOne.lastName).to.be.equal('Doe');
      expect(employeeTwo.firstName).to.be.equal('John');
    });

    it('should link employees with their departments data when using "populate" function', async () => {
      const employees = await Employee.find().populate('department');
      for(const employee of employees) {
        expect(employee.department).to.have.property('name');
      }
    });

  });

  describe('Creating data', () => {

    after(async () => {
      await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '4edd40c86762e0fb12000003',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Foo',
        lastName: 'Bar',
        department: '4edd40c86762e0fb12000004',
      });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { lastName: 'NotDoe' }});
      const updatedEmployee = await Employee.findOne({ lastName: 'NotDoe' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.lastName = 'NotDoe';
      await employee.save();
      const updatedEmployee = await Employee.findOne({ lastName: 'NotDoe' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'NotBar' }});
      const updatedEmployees = await Employee.find({ lastName: 'NotBar' });
      expect(updatedEmployees.length).to.be.equal(2);
    });

  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Foo',
        lastName: 'Bar',
        department: '4edd40c86762e0fb12000004',
      });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const deletedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employeeToDelete = await Employee.findOne({ firstName: 'John' });
      await employeeToDelete.remove();
      const deletedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const deletedEmployees = await Employee.find();
      expect(deletedEmployees.length).to.be.equal(0);
    });

  });

});
