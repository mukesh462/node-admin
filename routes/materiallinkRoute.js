const express = require('express');
const router = express.Router();
const MateriallinkController = require('../controllers/MateriallinkController');
const { upload } = require('../common/common');

router.post('/create',upload.single('filelink'),MateriallinkController.createMateriallink);
router.post('/list',MateriallinkController.listData);
router.delete('/delete/:id', MateriallinkController.deleteMateriallink);
router.post('/search', MateriallinkController.searchMaterialByName);

module.exports = router;