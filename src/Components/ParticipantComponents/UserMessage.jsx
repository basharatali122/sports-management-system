import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function SendNotification() {
    const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    try {
      await axios.post("http://localhost:3000/messages", { message });
      toast.success("Message sent to participants");
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  return (
    <div>
      {/* Notification Sender */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-9xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-500">
          Send Message
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          className="w-full rounded-lg p-4 resize-none mb-4 focus:border-none"
          rows={4}
        />
        <button
          onClick={handleSendMessage}
          className="w-1/4 font-bold bg-blue-600 text-white py-2 rounded hover:bg-cyan-700"
        >
          Send Message
        </button>
      </div>
    </div>
  )
}

export default SendNotification