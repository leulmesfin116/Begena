import express from "express";

import songRoute from "./routes/songRoutes.js";

const app = express();

app.use("/songs", songRoute);

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
