"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function TherapistMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // In demo mode, use localStorage
      const storedMessages: any[] = JSON.parse(
        localStorage.getItem("therapist-messages") || "[]"
      );
      setMessages(storedMessages);

      // Count unread
      const unread = storedMessages.filter(
        (m: any) => !m.read
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, read: true } : m
      )
    );
    localStorage.setItem(
      "therapist-messages",
      JSON.stringify(setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
      ))
    );
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading messages...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Messages
      </h1>

      {/* Summary */}
      <div className="card p-4 mb-6">
        <div className="flex between items-center">
          <div>
            <p className="text-sm text-muted">Unread messages</p>
            <p className="font-bold text-2xl text-primary">{unreadCount}</p>
          </div>
          <button
            onClick={() => window.alert("Mark all as read")}
            className="text-primary text-sm hover:text-primary/90"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages ({messages.length})</h2>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-lg bg-secondary/5 flex items-center justify-center text-muted">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="message-circle" size={48} className="mb-4" />
            <p>No messages yet.</p>
            <p className="text-sm">Messages from patients will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">From</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg: any) => (
                  <tr key={msg.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      {msg.from_name || "Patient"}
                    </td>
                    <td className="p-3 line-clamp-1">
                      {msg.subject}
                    </td>
                    <td className="p-3 text-sm text-muted">
                      {msg.date && new Date(msg.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {msg.read
                        ? <span className="bg-secondary/10 px-2 py-1 rounded text-xs">Read</span>
                        : (
                          <span
                            className="bg-primary/10 px-2 py-1 rounded text-xs text-primary unread-badge"
                            onClick={() => markAsRead(msg.id)}
                          >
                            Unread
                          </span>
                        )
                      }
                    </td>
                    <td className="p-3 text-right">
                      <button
                        className="text-primary hover:text-primary/90 text-sm"
                        onClick={() => window.alert("View message")}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="5">
                      No messages
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 text-center text-muted">
            Loading messages...
          </div>
        )}
      </div>
    </div>
  );
}