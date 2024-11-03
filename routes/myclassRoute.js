const express = require('express');
const router = express.Router();
const myclassController = require('../controllers/MyclassController');

router.post('/create', myclassController.createMyclass);
router.post('/list', myclassController.getAllMyclass);
router.get('/:id', myclassController.getMyclassById);
router.post('/update/:id', myclassController.updateMyclass);
router.delete('/delete/:id', myclassController.deleteMyclass);
router.post('/myclasses',myclassController.Myclasses);
module.exports = router;