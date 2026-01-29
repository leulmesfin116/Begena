import express from "express";

const route = express.Router();

route.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

export default route;
