import { Item, editItem } from "../models/itemModel.js";

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
  let items;
  if (req.body != "") {
    await Item.find({ name: req.body });
  }
  else items = await Item.find();

  res.status(200).json(items);
};

/** @type {import("express").RequestHandler} */
export const editItem = async (req, res) => {
  try {
    const name = req.body.name;
    const query = { name: name };
    const updated = await editItem.findOneAndUpdate(query, { score: req.body.score, wpm: req.body.wpm }, options)

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
