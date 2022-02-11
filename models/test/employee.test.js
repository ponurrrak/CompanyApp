const mongoose = require('mongoose');
const expect = require('chai').expect;
const Employee = require('../employee.model.js');

const mockDoc = {
  firstName: 'first string',
  lastName: 'second string',
  department: '4edd40c86762e0fb12000003',
};

describe('Employee', () => {

  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if any of its args is not passed', () => {
    for(const key in mockDoc) {
      const docCopy = { ...mockDoc };
      delete docCopy[key];
      const employee = new Employee(docCopy);
      employee.validate(err => {
        expect(err.errors[key]).to.exist;
      });
    }    
  });

  it('should throw an error if any of its args is not a string', () => {    
    const cases = [{}, []];
    for(const key in mockDoc) {
      for(const case_ of cases) {
        const employee = new Employee({ ...mockDoc, [key]: case_ });
        employee.validate(err => {
          expect(err.errors[key]).to.exist;
        });
      }      
    }      
  });

  it('should throw an error if "department" arg is too long or too short to be valid Mongoose _id', () => {
    const cases = ['4edd40c86762e0fb1200000', '4edd40c86762e0fb120000030'];
    for(const case_ of cases) {
      const employee = new Employee({ ...mockDoc, department: case_ });      
      employee.validate(err => {
        expect(err.errors.department).to.exist;
      });
    }
  });
 
  it('shouldn\'t throw an error if all args are okay', () => {       
    const employee = new Employee(mockDoc);
    employee.validate(err => {
      expect(err).to.not.exist;
    });    
  });

});
