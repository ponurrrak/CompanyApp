const express = require('express');
const { getAll, getRandom, getById, postNewItem, putChanges, deleteItem } = require('../controllers/employees.controller');
const router = express.Router();

router.get('/', getAll);
router.get('/random', getRandom);
router.get('/:id', getById);
router.post('/', postNewItem);
router.put('/:id', putChanges);
router.delete('/:id', deleteItem);

module.exports = router;
