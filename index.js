import express from "express";
import dotenv from "dotenv";
import { bootstrap } from "./src/index.routes.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

//bootstrap
bootstrap(app, express);
const port = parseInt(process.env.PORT);
app.listen(port || 5000, () =>
  console.log(`Example app listening on port ${port}!`)
);
