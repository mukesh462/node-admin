const express = require('express');
const router = express.Router();
const myclassController = require('../controllers/MyclassController');

router.post('/', myclassController.createMyclass);
router.get('/', myclassController.getAllMyclass);
router.get('/:id', myclassController.getMyclassById);
router.put('/:id', myclassController.updateMyclass);
router.delete('/:id', myclassController.deleteMyclass);

module.exports = router;