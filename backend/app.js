import express from "express";
import cors from "cors";

import ItemRoute from "./routes/itemRoute.js";
import ItemRoutecopy from "./routes/itemRoutecopy.js";

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/leaderboard1", ItemRoute);
app.use("/leaderboard2", ItemRoutecopy);

export default app;
