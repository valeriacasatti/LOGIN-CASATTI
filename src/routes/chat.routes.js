import { Router } from "express";
import { chatsService } from "../dao/index.js";

const router = Router();

//get all messagges
router.get("/", async (req, res) => {
  try {
    const messagges = await chatsService.getMessages();
    res.json({ status: "success", data: messagges });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export { router as chatsRouter };
