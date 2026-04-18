import React, { useState, useEffect, useRef } from 'react';
import { fetchChatHistory, sendChatMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, UserRound, Sparkles, Mic } from 'lucide-react';

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const TypingIndicator = () => (
  <motion.div
    className="chat-bubble bot typing-bubble"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div className="typing-dots">
      <span />
      <span />
      <span />
    </div>
  </motion.div>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const suggestions = [
    'What should I eat this week?',
    'Is back pain normal in week 24?',
    'Create a gentle sleep routine.',
    'Breathing tips for stress relief.',
  ];

  // Auto-scroll to the newest message
  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory();
        if (!active) return;
        const history = (data.messages || []).map((m) => ({
          ...m,
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : getTime(),
        }));
        setMessages(history);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load chat history.', error?.message || error);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { role: 'user', text: trimmed, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    inputRef.current?.focus();

    // Show typing indicator for ~1 second
    setIsTyping(true);
    try {
      const reply = await sendChatMessage(trimmed);
      await new Promise((r) => setTimeout(r, 1000));
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: 'bot', text: reply, time: getTime() }]);
    } catch (error) {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chat-header">
        <div className="chat-header-avatar">
          <Sparkles size={22} />
        </div>
        <div>
          <h2>AI Health Assistant</h2>
          <span className="chat-status">
            {isTyping ? 'Typing...' : 'Online'}
          </span>
        </div>
      </div>

      <div className="chat-window">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`chat-row ${m.role}`}
            initial={{ opacity: 0, x: m.role === 'user' ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {m.role === 'bot' && (
              <div className="avatar bot-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className={`chat-bubble ${m.role}`}>
              {m.text}
              <span className="msg-time">{m.time}</span>
            </div>
            {m.role === 'user' && (
              <div className="avatar user-avatar">
                <UserRound size={16} />
              </div>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <div className="chat-row bot">
              <div className="avatar bot-avatar">
                <Bot size={16} />
              </div>
              <TypingIndicator />
            </div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      <div className="chat-suggestions">
        <span>Suggested prompts</span>
        <div className="suggestion-row">
          {suggestions.map((item) => (
            <button key={item} type="button" onClick={() => setInput(item)}>
              <Sparkles size={14} /> {item}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-input">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isTyping}
        />
        <button className="chat-voice" type="button" aria-label="Voice input">
          <Mic size={18} />
        </button>
        <button onClick={handleSend} disabled={isTyping || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
