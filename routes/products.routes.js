const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Product = require('../models/product.model');

router.get('/', async (req, res) => {
  try {
    res.json(await Product.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Product.findOne().skip(randNum);
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
      itemFound = await Product.findById(req.params.id);
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
  const { name, client } = req.body;
  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/:id', async (req, res) => {
  const { name, client } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Product.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.name = name ? name : itemFound.name;
      itemFound.client = client ? client : itemFound.client;
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
      itemFound = await Product.findById(req.params.id);
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
