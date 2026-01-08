import { Request, Response } from "express";
import { CamperRequest } from "../models/CamperRequest";
import { Chat } from "../models/Chat";
import mongoose from "mongoose";

export const camperRequestController = {

  createRequest: async (req: Request, res: Response) => {
    try {
      const newRequest = await CamperRequest.create(req.body);
      res.status(201).json(newRequest);
    } catch (err) {
      res.status(400).json({ error: "Failed to create request", details: err });
    }
  },


  getRequestById: async (req: Request, res: Response) => {
    try {
      const found = await CamperRequest.findById(req.params.id)
        .populate("customerId")
        .populate("sellerId");

      if (!found) {
        return res.status(404).json({ error: "Request not found" });
      }

      res.json(found);
    } catch (err) {
      res.status(400).json({ error: "Invalid request ID", details: err });
    }
  },

  getRequestByCustomer: async (req: Request, res: Response) => {
    try {
      const requests = await CamperRequest.find({
        customerId: req.params.customerId,
      });

      res.json(requests);
    } catch (err) {
      res.status(400).json({ error: "Invalid customer ID", details: err });
    }
  },

  getAllRequests: async (_req: Request, res: Response) => {
    try {
      const requests = await CamperRequest.find()
        .populate({
          path: "customerId",
          select:
            "-password -refreshToken -passwordResetToken -passwordResetExpires",
        })
        .populate({
          path: "sellerId",
          select: "firstname lastname email role",
        });

      res.json(requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const updated = await CamperRequest.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Could not update request", details: err });
    }
  },


  updateSeller: async (req: Request, res: Response) => {
    try {
      const { sellerId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        return res.status(400).json({ error: "Invalid sellerId" });
      }

      const updated = await CamperRequest.findByIdAndUpdate(
        req.params.id,
        {
          sellerId,
          status: "assigned",
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }

      const chat = await Chat.findOne({ requestId: updated._id });

      if (!chat) {
        await Chat.create({
          requestId: updated._id,
          customerId: updated.customerId,
          sellerId: sellerId,
          messages: [],
        });
      } else {
        chat.sellerId = sellerId;
        await chat.save();
      }

      res.json(updated);
    } catch (err) {
      console.error("updateSeller error:", err);
      res.status(400).json({ error: "Could not update request", details: err });
    }
  },

  updatePrice: async (req: Request, res: Response) => {
    try {
      const updated = await CamperRequest.findByIdAndUpdate(
        req.params.id,
        { agreedPrice: req.body.agreedPrice },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Could not update request", details: err });
    }
  },


  updateRequest: async (req: Request, res: Response) => {
  try {
    const payload = {
      ...req.body,
      sellerId: req.body.sellerId || undefined 
    };

    const updated = await CamperRequest.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Request not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update request", details: err });
  }
},

  deleteRequest: async (req: Request, res: Response) => {
    try {
      const deleted = await CamperRequest.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Request not found" });
      }
      await Chat.deleteOne({ requestId: req.params.id });

      res.json({ message: "Request deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: "Failed to delete request", details: err });
    }
  },
};
