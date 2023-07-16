import express from "express";
import { all, create, remove, update } from "../controllers/task.js";

const router = express.Router();

router.post("/create", create);

router.put("/:id", update);

router.get("/all", all);

router.delete("/:id", remove);

export default router;