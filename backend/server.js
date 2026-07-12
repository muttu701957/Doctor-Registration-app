import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import authRoutes from "./routes/auth.route.js"
import doctorRouter from './routes/doctorRoute.js'
import chatRouter from './routes/chatRoute.js'
import bloodRouter from './routes/bloodRoute.js'
import messageModel from './models/messageModel.js'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from "socket.io";


dotenv.config();
//! App config
const app = express()
const server = http.createServer(app)

// roomId -> { socketId: { name, role } }  — who is actively viewing each chat window
const roomOnlineUsers = {};

//creating the socket instance
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing; adjust in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  console.log("🟢 NEW SOCKET CONNECTED:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (roomId) => {

    if (!roomId) {
      console.log("❌ Invalid room id");
      return;
    }

    socket.join(roomId);

    console.log("✅ USER JOINED ROOM");
    console.log("Room:", roomId);
    console.log("Socket:", socket.id);

    // SHOW ALL SOCKETS IN ROOM
    const clients = io.sockets.adapter.rooms.get(roomId);

    console.log(
      "👥 Total users in room:",
      clients ? clients.size : 0
    );
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    const { roomId, message, sender, senderType, time } = data;

    console.log("📩 MESSAGE RECEIVED FROM:", sender);

    // Persist to DB
    try {
      await messageModel.create({
        roomId,
        sender,
        senderType: senderType || "user",
        message,
      });
    } catch (err) {
      console.error("❌ Failed to save message:", err.message);
    }

    // Broadcast to everyone in the room EXCEPT the sender
    // (sender already added it locally — prevents duplicate messages)
    socket.to(roomId).emit("receive_message", { roomId, message, sender, time });

    console.log("✅ MESSAGE EMITTED TO ROOM:", roomId);
  });

  app.get("/service/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Doctor Service is healthy",
    service: "doctor-service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

  // USER OPENED A CHAT WINDOW — track as actively online in this room
  socket.on("user_online", ({ roomId, name, role }) => {
    if (!roomId || !name) return;
    if (!roomOnlineUsers[roomId]) roomOnlineUsers[roomId] = {};
    roomOnlineUsers[roomId][socket.id] = { name, role };

    // Tell the partner this user just came online
    socket.to(roomId).emit("partner_online", { name, online: true });

    // If partner is already in the room, tell this user immediately
    const alreadyOnline = Object.values(roomOnlineUsers[roomId]).find(u => u.name !== name);
    if (alreadyOnline) {
      socket.emit("partner_online", { name: alreadyOnline.name, online: true });
    }
  });

  // USER CLOSED CHAT WINDOW — remove from active tracking
  socket.on("user_offline", ({ roomId, name }) => {
    if (roomOnlineUsers[roomId]) {
      delete roomOnlineUsers[roomId][socket.id];
      if (Object.keys(roomOnlineUsers[roomId]).length === 0) {
        delete roomOnlineUsers[roomId];
      }
    }
    socket.to(roomId).emit("partner_online", { name, online: false });
  });

  // MARK MESSAGES AS SEEN — reader opened the room
  socket.on("mark_seen", async ({ roomId, readerName }) => {
    if (!roomId || !readerName) return;
    try {
      await messageModel.updateMany(
        { roomId, sender: { $ne: readerName }, seen: false },
        { $set: { seen: true, seenAt: new Date() } }
      );
      // Notify the sender that their messages have been read
      socket.to(roomId).emit("messages_seen", { roomId });
    } catch (err) {
      console.error("❌ mark_seen error:", err.message);
    }
  });

  // ── BLOOD DONATION ROOMS ────────────────────────────────────────────────
  // Each logged-in user/doctor joins their personal blood notification room
  socket.on("join_blood_room", (userId) => {
    if (!userId) return;
    socket.join(`blood-${userId}`);
    console.log(`🩸 Joined blood room: blood-${userId}`);
  });

  socket.on("leave_blood_room", (userId) => {
    if (!userId) return;
    socket.leave(`blood-${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 USER DISCONNECTED:", socket.id);
    // Remove from all rooms and notify partners
    for (const roomId in roomOnlineUsers) {
      if (roomOnlineUsers[roomId][socket.id]) {
        const { name } = roomOnlineUsers[roomId][socket.id];
        delete roomOnlineUsers[roomId][socket.id];
        socket.to(roomId).emit("partner_online", { name, online: false });
        if (Object.keys(roomOnlineUsers[roomId]).length === 0) {
          delete roomOnlineUsers[roomId];
        }
      }
    }
  });

});



const port = process.env.PORT || 4000


// Connect DB and cloudinary
connectDB()
connectCloudinary()

//! Middleware
app.use(express.json())
app.use(cookieParser())

// Define allowed origins
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5174", // local admin panel
  "https://zeventro.com",      // Production frontend
  "https://www.zeventro.com"   // If you use the www version
  
 // Deployed admin panel
];

//! CORS configuration (with logging and proper handling)
app.use(cors({
  origin: function (origin, callback) {
    console.log("CORS request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      // If origin is undefined or allowed, accept the request
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "atoken", "dtoken"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


// No need to duplicate app.options – already handled above

//! API Routes
app.use('/api/admin', adminRouter);
app.use("/api/auth", authRoutes);
app.use('/api/doctor', doctorRouter);
app.use('/api/chat', chatRouter);

app.use('/api/blood', bloodRouter);

// Expose io to controllers via app.get('io')
app.set('io', io);

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API working great!');
});

//! Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running at: http://localhost:${port}`);
  console.log("✅ Allowed Origins:", allowedOrigins);
});
