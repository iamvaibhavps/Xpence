import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react"; // Tailwind UI Modal component
import bot from "../assets/robot.png"; // Replace with your bot image path
const Chatbot = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // For modal
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        setInputMessage(transcript);
      };
      rec.onerror = (error) => {
        console.error("Speech Recognition Error", error);
      };
      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handlePdfUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await axios.post("http://localhost:8000/upload_pdf/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsTyping(true);
    try {
      const response = await axios.post("http://localhost:8000/ask_question/", {
        question: inputMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", content: inputMessage },
        { type: "bot", content: response.data.answer },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Chatbot Modal Button */}
      <button
        onClick={openModal}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 z-40"
      >
        🗣️
      </button>

      {/* Modal with PDF Upload and Chat */}
      <Dialog open={isOpen} onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div className="flex justify-center items-center h-full">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex justify-center items-center">
                    <img
                      src={bot} // Replace with an actual bot avatar image
                      alt="Bot Avatar"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Jarvis</h2>
                    <p className="text-sm text-gray-500">Your personal learning and finance assistant</p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-gray-500 text-xl">
                  ✖️
                </button>
              </div>

              {/* PDF Upload Section */}
              <div className="mt-4">
                <label className="block text-gray-700">Upload your PDF</label>
                <input
                  type="file"
                  onChange={handlePdfUpload}
                  className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Chat Window */}
              <div
                className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg space-y-4 mt-4"
                style={{ maxHeight: "60vh" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg p-3 shadow-md ${
                        msg.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-300 rounded-lg p-3 shadow-md text-gray-800 animate-pulse">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200ms"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-400ms"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input Section */}
              <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-300 bg-gray-200">
                <div className="flex items-center space-x-2 w-full">
                  <button
                    type="button"
                    onClick={startListening}
                    className="bg-purple-500 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-all"
                  >
                    🎤
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:opacity-90 transition-all"
                  >
                    Send
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Chatbot;
