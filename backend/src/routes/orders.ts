import { Router } from "express";

import { orderController } from "../controllers/orderController";

const router = Router();

router.get("/", orderController.getAllOrders);

router.get("/customer/:customerId", orderController.getOrdersByCustomer);
router.get("/:id", orderController.getOrderById);               
router.patch("/:id/status", orderController.updateStatus);

router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
