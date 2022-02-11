const mongoose = require('mongoose');
const expect = require('chai').expect;
const Department = require('../department.model.js');

describe('Department', () => {

  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});
    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for(const name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" is too long or too short', () => {
    const cases = ['abcd', 'very long department name'];
    for(const name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('shouldn\'t throw an error if "name" is okay', () => {
    const cases = ['abcde', 'long department name'];
    for(const name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });

});
