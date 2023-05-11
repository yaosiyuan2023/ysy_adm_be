import express from "express";

const router = express.Router();

router.get("/", (res, req) => {
  res.redirect("/login");
});

export default router;
