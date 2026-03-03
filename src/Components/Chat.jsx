import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { createSocketConnection } from "../Utils/Socket";


let socket;

const Chat = () => {
  const { requestId } = useParams();
  const user = useSelector((state) => state.user?.data?.user);
  const userId = user?.id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/chat/${requestId}`, {
          withCredentials: true,
        });
        const formatted = res?.data?.messages.map(({ senderId, text }) => ({
          name: `${senderId?.firstName} ${senderId?.lastName}`,
          text,
          senderId: senderId?._id,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [requestId]);

  useEffect(() => {
    if (!userId || !requestId) return;

    socket = createSocketConnection();
    socket.emit("joinChat", { name: user.name, userId, requestId });

    socket.on("messageReceived", ({ name, text, senderId }) => {
      setMessages((prev) => [...prev, { name, text, senderId }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, requestId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      name: user.name,
      userId,
      requestId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-full md:w-3/4 mx-auto mt-5 border border-gray-600 h-[70vh] flex flex-col rounded-lg shadow">
      <header className="bg-base-200 px-5 py-3 border-b border-gray-600 text-lg font-semibold">
        Chat
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4 bg-base-100">
        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === userId;
          return (
            <div key={idx} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-header text-sm text-gray-500">{msg.name}</div>
              <div className="chat-bubble bg-blue-500 text-white">{msg.text}</div>
              <div className="chat-footer text-xs opacity-60">Seen</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t border-gray-600 bg-base-200 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          className="flex-1 border border-gray-400 rounded py-2 px-3 text-white bg-black"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
