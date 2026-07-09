"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    // Get current user's session to know which messages are "mine"
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setCurrentUserId(data?.user?.id ?? null));
  }, [matchId]);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?matchId=${matchId}`);
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content: newMessage }),
    });

    if (res.ok) {
      setNewMessage("");
      fetchMessages(); // refresh the list after sending
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      <h1 className="mb-4 text-xl font-bold text-gray-900">Chat</h1>

      <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 ${
                  msg.senderId === currentUserId
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded border border-gray-300 p-2"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}