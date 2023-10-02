import express from "express";

import * as itemController from "../controllers/itemController.js";

const router = express.Router();

router.get("/:leaderboardType", itemController.getItems);
router.put("/:leaderboardType", itemController.editItems);
// router.post("/", itemController.createItem);
// router.delete("/:id", itemController.deleteItem);

export default router;
