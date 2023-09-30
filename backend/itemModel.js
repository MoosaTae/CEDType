import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  ranking: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
});
const itemSchemo = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
});
const Item = mongoose.model("Item", itemSchema);
const editItem = mongoose.model("editItem", itemSchemo);

export { Item, editItem };
