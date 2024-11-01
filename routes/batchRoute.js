const express = require("express");
const router = express.Router();
const batchController = require("../controllers/BatchController");

router.post("/list", batchController.getAllBatch);
router.post("/create", batchController.createBatch);
router.get("/getAllBatchData", batchController.getBatchAll);
router.post("/update/:id", batchController.updateBatch);
router.delete("/delete/:id", batchController.deleteBatch);
router.get("/:id", batchController.getBatchById);

module.exports = router;
