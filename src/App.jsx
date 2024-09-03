import './App.css';
import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [guideVisible, setGuideVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const chatEndRef = useRef(null);

  const generateAPIResponse = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Set loading to true before API call

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: inputText }]
          }]
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
      console.log("Message:", text);

      // Add user message and API response to the messages array
      setMessages([...messages, { text: inputText, role: 'user' }, { text: text, role: 'gemini' }]);
      setGuideVisible(false); // Hide guide after the first message
      setIsLoading(false); // Set loading to false after API response


    } catch (error) {
      console.log(error);
    }

    setInputText(""); // Clear the input field after submission
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Navbar at the top */}
      <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full z-10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Gemini Chat</span>
          </a>
        </div>
      </nav>

      {/* Main container */}
      <div className="flex flex-col justify-between bg-teal-700 h-screen pt-16">
        {/* Chat section */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 relative">
          
          {/* Display initial guide */}
          {guideVisible && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-600 p-4 rounded-lg shadow-md">
              <p className="text-white">Start by writing a prompt...</p>
            </div>
          )}
          {/* Display chat messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg shadow-md w-3/4 ${message.role === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-white text-black mr-auto'}`}
            >
              {message.text}
            </div>
          ))}
          
          {/* Display loading spinner when waiting for API response */}
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="loader"></div>
            </div>
          )}

          {/* Reference for scrolling */}
          <div ref={chatEndRef} />
        </div>

        {/* Input section at the bottom */}
        <div className="p-2 bg-black">
          <form onSubmit={generateAPIResponse} className='flex justify-center gap-4 items-center'>
            <input
              type="text"
              required
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (guideVisible && e.target.value.trim() !== '') {
                  setGuideVisible(false); // Hide guide when user starts typing
                }
              }}
              id="large-input"
              placeholder="Enter your text"
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
