const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Employee = require('../models/employee.model');

router.get('/', async (req, res) => {
  try {
    res.json(await Employee.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Employee.findOne().skip(randNum);
    if(randItem) {
      res.json(randItem);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/:id', async (req, res) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Employee.findById(req.params.id);
    }
    if(itemFound) {
      res.json(itemFound);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Employee.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.firstName = firstName ? firstName : itemFound.firstName;
      itemFound.lastName = lastName ? lastName : itemFound.lastName;
      itemFound.department = department ? department : itemFound.department;
      await itemFound.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
