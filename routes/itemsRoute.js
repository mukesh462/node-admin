const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ItemConteller');

router.post('/', itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.put('/:id', itemController.updateItem);
router.delete('/delete/:id', itemController.deleteItem);

module.exports = router;
