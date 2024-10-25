const express = require('express');
const router = express.Router();
const MateriallinkController = require('../controllers/MateriallinkController');

router.post('/create', MateriallinkController.createMateriallink);
router.delete('/delete/:id', MateriallinkController.deleteMateriallink);

module.exports = router;