import ChatList from "../components/ChatList.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

function ChatPage() {
s
  return (

    <div className="flex h-screen">

      <div className="w-1/4 border-r">
        <ChatList />
      </div>

      <div className="w-3/4">
        <ChatWindow />
      </div>

    </div>

  );
}

export default ChatPage;