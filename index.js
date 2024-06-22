import express from "express";
import dotenv from "dotenv";
import { app, io, server } from "./src/socket/socket.js";
import { bootstrap } from "./src/index.routes.js";

dotenv.config({ path: "./config/config.env" });

//bootstrap
bootstrap(app, express);

const port = parseInt(process.env.PORT);
server.listen(port || 5000, () =>
  console.log(`App listening on PORT ${port}!`)
);
