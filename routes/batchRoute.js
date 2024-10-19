const express = require('express');
const router = express.Router();
const batchController = require('../controllers/BatchController');

router.post('/', batchController.createBatch);
router.get('/', batchController.getAllBatch);
router.get('/:id', batchController.getBatchById);
router.put('/:id', batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);

module.exports = router;