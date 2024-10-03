const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../Helper/getUserDetailsFromToken");
const UserModel = require("../Models/UserModel");
const { ConversationModel, MessageModel } = require("../Models/ConversationModel");
const getConversation = require("../Helper/getConversation");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUsers = new Set();

// Utility function to safely emit errors to clients
const emitError = (socket, message, err) => {
  console.error(message, err);
  socket.emit("error", { message });
};

// Utility function to fetch and emit updated conversations
const emitUpdatedConversation = async (senderId, receiverId, io) => {
  const conversationsSender = await getConversation(senderId);
  const conversationsReceiver = await getConversation(receiverId);
  
  io.to(senderId).emit("conversation", conversationsSender);
  io.to(receiverId).emit("conversation", conversationsReceiver);
};

// Utility function to fetch a conversation between two users
const getConversationBetweenUsers = (userId1, userId2) => {
  return ConversationModel.findOne({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  }).populate("messages").sort({ updatedAt: -1 });
};

io.on("connection", async (socket) => {
  console.log("User connected", socket.id);

  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user?._id) return;

    const userIdStr = user._id.toString();
    socket.join(userIdStr);
    onlineUsers.add(userIdStr);

    io.emit("onlineUser", Array.from(onlineUsers));

    // New message event handler
    socket.on("new-Message", async (userId) => {
      try {
        const userDetails = await UserModel.findById(userId).select("-password");

        if (!userDetails) return;
        
        const payload = {
          userId: userDetails._id,
          name: userDetails.name,
          profile_picture: userDetails.profile_picture,
          message: "User joined the App",
          online: onlineUsers.has(userId),
        };

        socket.emit("message-user", payload);

        // Get previous messages between the users
        const conversation = await getConversationBetweenUsers(user._id, userId);
        socket.emit("message", conversation?.messages || []);
      } catch (err) {
        emitError(socket, "Failed to retrieve new message.", err);
      }
    });

    // Send message event handler
    socket.on("send-message", async (data) => {
      try {
        let conversation = await getConversationBetweenUsers(data.sender, data.receiver);

        // If no conversation exists, create one
        if (!conversation) {
          conversation = new ConversationModel({
            sender: data.sender,
            receiver: data.receiver,
          });
          await conversation.save();
        }

        // Create and save the new message
        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgbyID: data.msgbyID,
        });

        const savedMessage = await message.save();

        // Update the conversation with the new message
        await ConversationModel.findByIdAndUpdate(conversation._id, {
          $push: { messages: savedMessage._id },
        });

        // Fetch and emit the updated conversation to both users
        const updatedConversation = await getConversationBetweenUsers(data.sender, data.receiver);

        io.to(data.sender).emit("message", updatedConversation?.messages || []);
        io.to(data.receiver).emit("message", updatedConversation?.messages || []);

        // Emit updated conversation list to both users
        await emitUpdatedConversation(data.sender, data.receiver, io);
      } catch (err) {
        emitError(socket, "Failed to send message.", err);
      }
    });

    // Sidebar event handler
    socket.on("sidebar", async (currentUserId) => {
      try {
        const conversation = await getConversation(currentUserId);
        socket.emit("conversation", conversation);
      } catch (err) {
        emitError(socket, "Failed to fetch sidebar data.", err);
      }
    });

    // Seen event handler
    socket.on("seen", async (msgbyUserId) => {
      try {
        const conversation = await getConversationBetweenUsers(user._id, msgbyUserId);
        const messageIds = conversation?.messages.map(msg => msg._id) || [];

        await MessageModel.updateMany(
          { _id: { $in: messageIds }, msgbyID: msgbyUserId },
          { $set: { seen: true } }
        );

        await emitUpdatedConversation(user._id.toString(), msgbyUserId, io);
      } catch (err) {
        emitError(socket, "Failed to mark messages as seen.", err);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      onlineUsers.delete(userIdStr);
      console.log("User disconnected", socket.id);
      io.emit("onlineUser", Array.from(onlineUsers));
    });

  } catch (err) {
    emitError(socket, "Failed to connect to the server.", err);
  }
});

module.exports = {
  app,
  httpServer,
};
