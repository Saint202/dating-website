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
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setCurrentUserId(data?.user?.id ?? null));
  }, [matchId]);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?matchId=${matchId}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
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
      fetchMessages();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] flex-col px-4 py-8">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <h1 className="mb-4 text-2xl font-semibold text-foreground">Chat</h1>

        <div className="stack-card flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <p className="text-center text-muted">No messages yet. Say hi! 👋</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    msg.senderId === currentUserId
                      ? "bg-coral text-white"
                      : "bg-background text-foreground"
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
            className="flex-1 rounded-full border border-border bg-white p-3 px-4 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
          <button
            type="submit"
            className="rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}