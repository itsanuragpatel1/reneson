import express from "express";
import { createStat, deleteStat, getStats, updateStat } from "../controllers/statController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/multerMiddleware.js";

const statRoutes = express.Router();

// upload.none() parses multipart/form-data requests without files so req.body works correctly

statRoutes.post("/create",adminAuth,upload.none(),createStat);  
statRoutes.get("/all", getStats);
statRoutes.put("/:id", adminAuth, upload.none(),updateStat);
statRoutes.delete("/:id", adminAuth, deleteStat);

export  {statRoutes}