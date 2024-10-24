const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/SubcategoryController');

router.post('/create', subcategoryController.createSubcategory);
router.post('/list', subcategoryController.getAllSubcategory);
router.get('/:id', subcategoryController.getSubcategoryById);
router.post('/update/:id', subcategoryController.updateSubcategory);
router.delete('/delete/:id', subcategoryController.deleteSubcategory);
router.post('/getallsubcategory_by_id', subcategoryController.getallsubcategory_by_id);

module.exports = router;