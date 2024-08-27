import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../auth/useAuth";

import "./chat.css";

function Chat({ builderId, buyerId, name }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrCreateConversation() {
      try {
        const { data: conversations, error: fetchError } = await supabase
          .from("conversations")
          .select("id")
          .eq("builder_id", builderId)
          .eq("buyer_id", buyerId);

        if (fetchError) {
          console.error("Error fetching conversations:", fetchError);
          return;
        }

        if (conversations.length > 0) {
          setConversationId(conversations[0].id);
        } else {
          const { data: newConversation, error: insertError } = await supabase
            .from("conversations")
            .insert([{ builder_id: builderId, buyer_id: buyerId }])
            .single();

          if (insertError) {
            console.error("Error creating conversation:", insertError);

            if (insertError.message.includes("duplicate key value")) {
              const { data: existingConversations, error: retryError } =
                await supabase
                  .from("conversations")
                  .select("id")
                  .eq("builder_id", builderId)
                  .eq("buyer_id", buyerId);

              if (retryError) {
                console.error(
                  "Error fetching existing conversation:",
                  retryError
                );
                return;
              }

              if (existingConversations.length > 0) {
                setConversationId(existingConversations[0].id);
              }
            }
          } else {
            setConversationId(newConversation.id);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }

    fetchOrCreateConversation();
  }, [builderId, buyerId]);

  useEffect(() => {
    if (conversationId) {
      async function fetchMessages() {
        try {
          const { data: msgs, error: fetchMessagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("sent_at", { ascending: true });

          if (fetchMessagesError) {
            console.error("Error fetching messages:", fetchMessagesError);
            return;
          }
          setMessages(msgs);
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }

      fetchMessages();

      const subscription = supabase
        .channel("private-chat")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            if (payload.new.conversation_id === conversationId) {
              setMessages((prevMessages) => [...prevMessages, payload.new]);
            }
          }
        )
        .subscribe();

      return () => {
        if (subscription) {
          subscription.unsubscribe(); // Correctly unsubscribe from the channel
        }
      };
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const { error } = await supabase.from("messages").insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            message_text: newMessage,
          },
        ]);

        if (error) {
          console.error("Error sending message:", error);
        } else {
          setNewMessage("");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // return (
  //   <div className="chat-container">
  //     <h2 className="chat-header" onClick={toggleMinimize}>{name || "Chat"}</h2>
  //     <div className="messages-container">
  //       {messages.map((msg) => (
  //         <div
  //           key={msg.id}
  //           className={`message ${
  //             msg.sender_id === user.id ? "sent" : "received"
  //           }`}
  //         >
  //           <div className="message-text">{msg.message_text}</div>
  //         </div>
  //       ))}
  //       <div ref={messagesEndRef} />
  //     </div>
  //     <div className="input-container">
  //       <input
  //         value={newMessage}
  //         onChange={(e) => setNewMessage(e.target.value)}
  //         placeholder="Type your message here..."
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") handleSendMessage();
  //         }}
  //       />
  //       <button onClick={handleSendMessage}>Send</button>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-header" onClick={toggleMinimize}>
        <h2>{name || "Chat"}</h2>
        <button className="toggle-button">
          {isMinimized ? "Expand" : "Minimize"}
        </button>
      </div>
      {!isMinimized && (
        <>
          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender_id === builderId ? "sent" : "received"
                }`}
              >
                <div className="message-text">{msg.message_text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
