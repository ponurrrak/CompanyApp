const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const collection = 'employees';

router.get('/', (req, res) => {
  req.db.collection(collection).find().toArray((err, data) => {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.json(data);
    }
  });
});

router.get('/random', (req, res) => {
  req.db.collection(collection).aggregate([{$sample: { size: 1 }}]).toArray((err, data) => {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.json(data[0]);
    }
  });
});

router.get('/:id', (req, res) => {
  req.db.collection(collection).findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
    if(err) {
      res.status(500).json({ message: err });
    } else if(!data) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(data);
    }
  });
});

router.post('/', (req, res) => {
  const { firstName, lastName, department } = req.body;
  req.db.collection(collection).insertOne({ firstName, lastName, department }, err => {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.json({ message: 'OK' });
    }
  });
});

router.put('/:id', (req, res) => {
  req.db.collection(collection).updateOne({ _id: ObjectId(req.params.id) }, { $set: { ...req.body } }, err => {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.json({ message: 'OK' });
    }
  });
});

router.delete('/:id', (req, res) => {
  req.db.collection(collection).deleteOne({ _id: ObjectId(req.params.id) }, err => {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.json({ message: 'OK' });
    }
  });
});

module.exports = router;
