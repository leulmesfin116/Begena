import express from "express";

const app = express();
const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`The serevr has started at Port:${PORT}`);
});
