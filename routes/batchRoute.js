const express = require('express');
const router = express.Router();
const batchController = require('../controllers/BatchController');

router.post('/list', batchController.getAllBatch);
router.post('/create', batchController.createBatch);
router.get('/:id', batchController.getBatchById);
router.post('/update/:id', batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);

module.exports = router;