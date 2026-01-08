import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { dimensions, customerId } = req.body;

  if (!customerId)
    return res.status(400).json({ error: "customerId is required" });


if (!mongoose.Types.ObjectId.isValid(customerId)) {
  return res.status(400).json({ error: "Invalid customerId" });
}

if (
  dimensions?.height === undefined ||
  dimensions?.width === undefined ||
  dimensions?.length === undefined
) {
    return res.status(400).json({
      error: "Height, Width and Length are required in dimensions",
    });
  }

  if (!dimensions.doorDimensions) {
  return res.status(400).json({ error: "doorDimensions is required" });
}

const { doorPlacement, doorWidth, doorHeight } = dimensions.doorDimensions;
if (!doorPlacement || !["right", "left", "aft"].includes(doorPlacement)) {
  return res.status(400).json({ error: "doorPlacement is invalid" });
}
if (doorWidth === undefined || doorHeight === undefined) {
  return res.status(400).json({ error: "doorWidth and doorHeight are required" });
}


  next();
};