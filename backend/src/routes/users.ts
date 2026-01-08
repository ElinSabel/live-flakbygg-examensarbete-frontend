import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.post("/", userController.createUser);

router.get("/", userController.getAllUsers);

router.get("/email/:email", userController.getUserByEmail);

router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router;