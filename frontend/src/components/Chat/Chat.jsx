import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../auth/useAuth";

function Chat({ builderId, buyerId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrCreateConversation() {
      try {
        // Check if the conversation already exists
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
          // If conversation exists, use its ID
          setConversationId(conversations[0].id);
        } else {
          // Create a new conversation
          const { data: newConversation, error: insertError } = await supabase
            .from("conversations")
            .insert([{ builder_id: builderId, buyer_id: buyerId }])
            .single();

          if (insertError) {
            console.error("Error creating conversation:", insertError);

            if (insertError.message.includes("duplicate key value")) {
              console.warn(
                "Conversation already exists, fetching the existing conversation."
              );

              // Fetch the existing conversation again
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
            console.log("New conversation created:", newConversation);
            // Set the new conversation ID
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
      // Fetch initial messages
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

      // Subscribe to new messages
      const subscription = supabase
        .channel("private-chat")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            console.log("Change received!", payload);
            // Ensure the message belongs to the current conversation
            if (payload.new.conversation_id === conversationId) {
              setMessages((prevMessages) => [...prevMessages, payload.new]);
            }
          }
        )
        .subscribe();

      // Cleanup subscription on component unmount or conversationId change
      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const { error } = await supabase
          .from("messages")
          .insert([
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

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.message_text}</div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Chat;
