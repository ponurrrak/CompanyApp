const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Department = require('../models/department.model');

router.get('/', async (req, res) => {
  try {
    res.json(await Department.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Department.findOne().skip(randNum);
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
      itemFound = await Department.findById(req.params.id);
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
  const { name } = req.body;
  try {
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Department.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.name = name;
      await itemFound.save();
      res.json(itemFound);
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
      itemFound = await Department.findById(req.params.id);
    }
    if(itemFound) {
      await itemFound.remove();
      res.json(itemFound);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
