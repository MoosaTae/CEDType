import { Item, editItem } from "../itemModel.js";

/** @type {import("express").RequestHandler} */
/*export const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};*/

/** @type {import("express").RequestHandler} */
export const getItems = async (req, res) => {
  const items = await Item.find().sort({ score: -1, wpm: -1 });
  console.log(items);
  res.status(200).json(items);
};
/** @type {import("express").RequestHandler} */
export const getItems2 = async (req, res) => {
  const items = await editItem.find().sort({ score: -1, wpm: -1 });
  console.log(items);
  res.status(200).json(items);
};
/** @type {import("express").RequestHandler} */
export const editItems = async (req, res) => {
  try {
    const name = req.body.name;
    const query = { name: name };
    const updated = await Item.findOneAndUpdate(query, { score: req.body.score, wpm: req.body.wpm }, options)

    if (updated) {
      res.status(200).json({ message: "OK" });
    } else {
      const newItem = new Item(req.body);
      await newItem.save();
      res.status(200).json({ message: "OK" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
/** @type {import("express").RequestHandler} */
export const editItems2 = async (req, res) => {
  try {
    const name = req.body.name;
    const query = { name: name };
    const updated = await editItem.findOneAndUpdate(query, {$set: { score: req.body.score, wpm: req.body.wpm }})
    
    if (updated) {
      res.status(200).json({ message: "OK" });
    } else {
      const newItem = new editItem(req.body);
      await newItem.save();
      res.status(200).json({ message: "OK" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};