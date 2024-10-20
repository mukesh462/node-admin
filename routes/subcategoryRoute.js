const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/SubcategoryController');

router.post('/create', subcategoryController.createSubcategory);
router.post('/list', subcategoryController.getAllSubcategory);
router.get('/:id', subcategoryController.getSubcategoryById);
router.post('/update/:id', subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;