import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useEffect, useState } from "react";

export default function ChatPanel({ role }) {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleData = (payload, participant) => {
      const text = new TextDecoder().decode(payload);

      try {
        const msg = JSON.parse(text);
        if (msg.type === "raise-hand") return; // don't show in chat
      } catch {}

      setMessages((prev) => [
        ...prev,
        { sender: participant?.identity || "Unknown", text },
      ]);
    };

    room.on("dataReceived", handleData);
    return () => room.off("dataReceived", handleData);
  }, [room]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const encoder = new TextEncoder();
      await localParticipant.publishData(encoder.encode(input), {
        reliable: true,
      });

      setMessages((prev) => [...prev, { sender: "Me", text: input }]);
      setInput("");
    } catch (e) {
      console.error("❌ sendMessage failed", e);
      alert("Message send failed (permission/token issue)");
    }
  };

  const raiseHand = async () => {
    const message = {
      type: "raise-hand",
      sender: localParticipant?.identity || "unknown",
    };

    try {
      const encoder = new TextEncoder();
      await localParticipant.publishData(
        encoder.encode(JSON.stringify(message)),
        { reliable: true }
      );
      console.log("raise-hand sent", message);
    } catch (e) {
      console.error(" raise-hand failed", e);
      alert("Raise hand failed (permission/token issue)");
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chat-bubble">
            <span className="chat-name">{msg.sender}</span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        {role === "student" && (
          <button className="raise-hand-btn" onClick={raiseHand} title="Raise hand">
            ✋
          </button>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your message here"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}