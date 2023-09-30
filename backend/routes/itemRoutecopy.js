import express from "express";

import * as itemController from "../controllers/itemController.js";

const router2 = express.Router();

router2.get("/", itemController.getItems2);
// router.post("/", itemController.createItem);
router2.put("/", itemController.editItems2);
// router.delete("/:id", itemController.deleteItem);

export default router2;
