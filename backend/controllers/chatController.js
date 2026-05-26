import messageModel from "../models/messageModel.js";

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await messageModel
      .find({ roomId })
      .sort({ timestamp: 1 })
      .lean();
    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Returns only the roomIds (from the supplied list) that have at least one message,
// plus metadata (last message preview + timestamp) for the chat list UI.
export const getActiveRooms = async (req, res) => {
  try {
    const { roomIds } = req.body;
    if (!roomIds?.length) return res.json({ success: true, activeRooms: {} });

    const latest = await messageModel.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage:   { $first: "$message" },
          lastSender:    { $first: "$sender" },
          lastTimestamp: { $first: "$timestamp" },
        },
      },
    ]);

    const activeRooms = {};
    latest.forEach(r => { activeRooms[r._id] = r; });

    res.json({ success: true, activeRooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
