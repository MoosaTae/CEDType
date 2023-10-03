import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import ItemRoute from "./routes/itemRoute.js";

const app = express();
var limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 requests per windowMs
});
// apply rate limiter to all requests
app.use(limiter);

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/leaderboard", ItemRoute);

export default app;
