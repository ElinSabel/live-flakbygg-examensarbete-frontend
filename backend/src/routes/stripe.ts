import { Router } from "express";
import {
  createCheckoutSession,
  getSession,
} from "../controllers/stripeController";

const router = Router();

router.post("/create-embedded-session", createCheckoutSession);
router.get("/sessions/:id", getSession);

export default router;