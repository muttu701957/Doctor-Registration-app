import express from "express";
import { getMessages, getActiveRooms } from "../controllers/chatController.js";
import { flexAuth } from "../middlewares/flexAuth.js";

const chatRouter = express.Router();

chatRouter.get("/messages/:roomId", flexAuth, getMessages);
chatRouter.post("/active-rooms", flexAuth, getActiveRooms);

export default chatRouter;
