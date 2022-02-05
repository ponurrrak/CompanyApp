const ObjectId = require('mongodb').ObjectId;
const Employee = require('../models/employee.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Employee.find().populate('department'));
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Employee.findOne().skip(randNum).populate('department');
    if(randItem) {
      res.json(randItem);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Employee.findById(req.params.id).populate('department');
    }
    if(itemFound) {
      res.json(itemFound);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postNewItem = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putChanges = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Employee.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.firstName = firstName;
      itemFound.lastName = lastName;
      itemFound.department = department;
      await itemFound.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteItem = async (req, res) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Employee.findById(req.params.id);
    }
    if(itemFound) {
      await itemFound.remove();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};
