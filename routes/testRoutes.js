import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Testing Route");
});

export default router;