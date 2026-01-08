import { Router } from "express";
import { camperRequestController } from "../controllers/camperRequestController";
import { validateRequest } from "../middleware/camperRequest";

const router = Router();

router.get("/", camperRequestController.getAllRequests);
router.post("/", validateRequest, camperRequestController.createRequest);

router.get("/customer/:customerId", camperRequestController.getRequestByCustomer);
router.get("/:id", camperRequestController.getRequestById);

router.patch("/:id/status", camperRequestController.updateStatus);
router.patch("/:id/seller", camperRequestController.updateSeller);
router.patch("/:id/price", camperRequestController.updatePrice);

router.put("/:id", camperRequestController.updateRequest);
router.delete("/:id", camperRequestController.deleteRequest);

export default router;
