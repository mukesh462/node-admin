const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

router.post('/create', categoryController.createCategory);
router.post('/list', categoryController.getAllCategory);
router.get('/:id', categoryController.getCategoryById);
router.post('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);
router.post('/getlist', categoryController.getCategories);

module.exports = router;