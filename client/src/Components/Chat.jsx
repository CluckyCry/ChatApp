import { useEffect, useRef, useState } from "react";
import "../CSS/chat.css";

export default function Chat({ name, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const messagesRef = useRef([]);

  function handleChange(event) {
    setText(event.target.value);
  }

  function srollToBottom() {
    let messages = document.getElementById("msgs");
    messages.scrollTop = messages.scrollHeight;
  }

  function addMsg(t) {
    // t = text
    if (t == "") return;
    let msg = `${name.current}: ${t}`;
     // emits the message to the server
    socket.emit("msg", msg);
    setMessages([...messages, msg]);
    messagesRef.current = [...messagesRef.current, msg];
    setText("");
  }

  // emitting sockets
  useEffect(() => {
    
    addEventListener("keyup", (event) => {
      let inputField = document.getElementById("text-area");
      if (event.key == "Enter" && document.activeElement == inputField) {
        addMsg(textRef.current);
        inputField.blur();
      }
    });

    socket.on("chat_msg", (msg) => {
      setMessages([...messages, msg]);
      messagesRef.current = [...messagesRef.current, msg];
    });

    socket.on("user-joined", (user_name) => {
      let msg = `${user_name} has joined the chat`;
      setMessages([...messages, msg]);
      messagesRef.current = [...messagesRef.current, msg];
    });

    socket.on("user-left", (user_name) => {
      let msg = `${user_name} has left the chat`;
      setMessages([...messages, msg]);
      messagesRef.current = [...messagesRef.current, msg];
    });
  }, []);

  // on every change of messages, scroll to the bottom:
  useEffect(() => {
    srollToBottom();
  }, [messages]);

  // every time text changes, update the ref too:
  useEffect(() => {
    textRef.current = text
  }, [text])

  return (
    <div className="chat">
      <div id="msgs" className="messages">
        {messagesRef.current.map((msg, ind) => (
          <div key={ind} className="message">
            <span className="msg">{msg}</span>
          </div>
        ))}
      </div>
      <div className="contents">
        <input
          id="text-area"
          onChange={handleChange}
          type="text"
          placeholder="Type message"
          value={text}
        />
        <input onClick={() => addMsg(text)} type="button" value="Send" />
      </div>
    </div>
  );
}
