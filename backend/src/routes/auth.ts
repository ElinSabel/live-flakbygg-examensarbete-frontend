import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController";
import { verifyAccessToken } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/password/request", requestPasswordReset);
router.post("/password/reset", resetPassword);


router.get("/me", verifyAccessToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
