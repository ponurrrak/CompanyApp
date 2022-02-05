const ObjectId = require('mongodb').ObjectId;
const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
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
};

exports.getById = async (req, res) => {
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
};

exports.postNewItem = async (req, res) => {
  const { name, client } = req.body;
  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putChanges = async (req, res) => {
  const { name, client } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Product.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.name = name;
      itemFound.client = client;
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
};
