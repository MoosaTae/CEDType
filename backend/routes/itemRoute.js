import express from "express";

import * as itemController from "../controllers/itemController.js";

const router = express.Router();

router.get("/", itemController.getItems);
// router.post("/", itemController.createItem);
router.put("/", itemController.editItems);
// router.delete("/:id", itemController.deleteItem);

export default router;
