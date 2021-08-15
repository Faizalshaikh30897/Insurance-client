import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { default as PolicyRouter } from "./routes/policy";
import { setupDB } from "./db/setupDB";

dotenv.config();

const main = async () => {
  await setupDB();
  console.log("DB setup done");

  const app = express();
  const port = process.env.PORT || 8080;
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    })
  );

  app.use(json());

  app.use("/api/v1/policy", PolicyRouter);

  app.listen(port, () => {
    console.log(`app started at port ${port}`);
  });
};

main();
