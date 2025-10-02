import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const backgrounds = {
  stars: "/stars.jpg",
  river: "/river.jpg",
  gorge: "/gorge.jpg",
  pug: "/pug.jpg",
  friend: "/friend.jpg",
  railroad: "/railroad.jpg",
};

const verbs = ["Shout", "Whisper", "Wheep", "Spill the Tea", "Converse"];

function App() {
  const [message, setMessage] = useState("");
  const [disappearMode, setDisappearMode] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [bgChoice, setBgChoice] = useState("stars");
  const [selectedVerb, setSelectedVerb] = useState(verbs[0]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setHeaderVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!disappearMode || !message.trim()) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const startTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setMessage((prev) => {
          if (!prev.length) {
            clearInterval(intervalRef.current);
            return "";
          }
          return prev.slice(1);
        });
      }, 150);
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, [message, disappearMode]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setSentMessages((prev) => [...prev, { id: Date.now(), text: message }]);
    setMessage("");
  };

  const handleAnimationEnd = (id) =>
    setSentMessages((prev) => prev.filter((msg) => msg.id !== id));

  const downloadMessage = () => {
    if (!message.trim()) return;
    const blob = new Blob([message], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "echo.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVerbStyles = (verb) => {
    switch (verb) {
      case "Shout":
        return "font-bold text-red-200 text-2xl drop-shadow-lg";
      case "Whisper":
        return "text-white/60 text-sm";
      case "Wheep":
        return "text-blue-300 italic text-lg opacity-80";
      case "Spill the Tea":
        return "italic text-white text-base";
      case "Converse":
        return "text-white text-base";
      default:
        return "text-white text-base";
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 overflow-hidden transition-background duration-500"
      style={{
        backgroundImage: `url(${backgrounds[bgChoice]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1
        className={`text-4xl font-bold mb-6 transition-opacity duration-1000 ${
          headerVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <select
          value={selectedVerb}
          onChange={(e) => setSelectedVerb(e.target.value)}
          className="bg-gray-900/75 text-white px-2 py-1 rounded mr-2"
        >
          {verbs.map((verb) => (
            <option key={verb} value={verb}>
              {verb}
            </option>
          ))}
        </select>
        at the{" "}
        <select
          value={bgChoice}
          onChange={(e) => setBgChoice(e.target.value)}
          className="bg-gray-900/75 text-white px-2 py-1 rounded ml-2"
        >
          <option value="stars">Stars</option>
          <option value="river">River</option>
          <option value="gorge">Gorge</option>
          <option value="friend">Friend</option>
          <option value="pug">Pug</option>
          <option value="railroad">Railroad</option>
        </select>
      </h1>
      <label className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={disappearMode}
          onChange={(e) => setDisappearMode(e.target.checked)}
          className="accent-purple-500"
        />
        <span>Disappearing mode</span>
      </label>
      <textarea
        className={`w-full max-w-2xl h-96 p-4 rounded-lg bg-gray-900/80 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-shadow duration-300 mb-4 ${getVerbStyles(selectedVerb)}`}
        placeholder="Type out loud here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex gap-4 mb-4">
        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          {selectedVerb} to the {bgChoice}
        </button>
        <button
          onClick={downloadMessage}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Keep as Download
        </button>
      </div>
      {sentMessages.map((msg) => (
        <div
          key={msg.id}
          className={`absolute left-1/2 transform -translate-x-1/2 bottom-40 animate-flyup ${getVerbStyles(selectedVerb)}`}
          onAnimationEnd={() => handleAnimationEnd(msg.id)}
        >
          {msg.text}
        </div>
      ))}
      <style>{`
        @keyframes flyup {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-400px) scale(1.2); }
        }
        .animate-flyup { animation: flyup 2s forwards; }
      `}</style>
    </div>
  );
}

export default App;
