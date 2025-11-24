'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

/**
 * AI Chatbot Component
 *
 * Customer service chatbot with subtle sales focus
 * Professional, conversational interface matching luxury aesthetic
 */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Contact information
const PHONE = "971523041482";
const PHONE_DISPLAY = "+971 52 304 1482";
const EMAIL = "info@mouhajerdesign.com";
const WHATSAPP_LINK = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hello! I'm interested in your design services.")}`;

// Pre-defined responses for common queries (shorter, actionable)
const chatbotResponses: { [key: string]: string } = {
  greeting: "Hello! Welcome to Mouhajer Design. We create exceptional spaces—residential, commercial, and hospitality. How can I help you today?",

  services: "We specialize in:\n• Architecture & Planning\n• Interior Design\n• FF&E Specification\n• Project Management\n• Custom Furniture\n\nWhich interests you?",

  projects: "We've completed 150+ projects including luxury residences, 5-star hotels, and award-winning restaurants. Partners include Address Hotels. Browse our Projects page!",

  consultation: "Let's schedule a complimentary consultation! Contact us:\n\n💬 [WhatsApp](" + WHATSAPP_LINK + ")\n📧 [Email](mailto:" + EMAIL + ")\n📞 [Call](" + PHONE_DISPLAY + ")\n\nWhat type of project are you considering?",

  pricing: "Every space is unique—we create bespoke solutions tailored to your needs. For a personalized quote:\n\n💬 [WhatsApp](" + WHATSAPP_LINK + ")\n📧 [Email](mailto:" + EMAIL + ")\n📞 [Call " + PHONE_DISPLAY + "](tel:+" + PHONE + ")",

  timeline: "Typical timeline:\n• Concept: 2-3 weeks\n• Design: 3-4 weeks\n• Documentation: 4-6 weeks\n\nDiscuss your project:\n💬 [WhatsApp](" + WHATSAPP_LINK + ")\n📞 [Call](tel:+" + PHONE + ")",

  contact: "Reach us:\n\n💬 [WhatsApp " + PHONE_DISPLAY + "](" + WHATSAPP_LINK + ")\n📧 [" + EMAIL + "](mailto:" + EMAIL + ")\n📞 [Call " + PHONE_DISPLAY + "](tel:+" + PHONE + ")\n📍 Dubai, UAE\n\nWe respond within 2 hours!",

  default: "I'm here to help! Choose:\n\n💬 [WhatsApp](" + WHATSAPP_LINK + ") (instant)\n📧 [Email](mailto:" + EMAIL + ")\n📞 [Call](tel:+" + PHONE + ")\n\nWhat works best?",
};

// Quick action buttons
const quickActions = [
  { id: 'services', label: 'Our Services', icon: '🎨' },
  { id: 'projects', label: 'View Projects', icon: '🏗️' },
  { id: 'consultation', label: 'Book Consultation', icon: '📅' },
  { id: 'contact', label: 'Contact Us', icon: '💬' },
];

// Convert markdown links to clickable HTML
function renderMessageWithLinks(text: string) {
  // Replace markdown links [text](url) with clickable links
  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return parts.map((part, index) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline hover:text-blue-700"
        >
          {linkText}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with greeting when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage('assistant', chatbotResponses.greeting);
      }, 500);
    }
  }, [isOpen]);

  // Add message
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Get bot response
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Match keywords to responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return chatbotResponses.greeting;
    }
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do you')) {
      return chatbotResponses.services;
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      return chatbotResponses.projects;
    }
    if (lowerMessage.includes('consult') || lowerMessage.includes('meeting') || lowerMessage.includes('appointment')) {
      return chatbotResponses.consultation;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('budget')) {
      return chatbotResponses.pricing;
    }
    if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('duration')) {
      return chatbotResponses.timeline;
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return chatbotResponses.contact;
    }

    return chatbotResponses.default;
  };

  // Handle send message
  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage('user', inputValue);
    setInputValue('');

    // Simulate typing
    setIsTyping(true);
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      addMessage('assistant', response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay 1-2s
  };

  // Handle quick action
  const handleQuickAction = (actionId: string) => {
    const response = chatbotResponses[actionId] || chatbotResponses.default;

    // Add user's selection as message
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      addMessage('user', action.label);
    }

    // Show typing and respond
    setIsTyping(true);
    setTimeout(() => {
      addMessage('assistant', response);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 1.2,
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-24 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 shadow-2xl transition-all hover:scale-110 hover:bg-neutral-900"
          >
            <Sparkles className="h-7 w-7 text-white" strokeWidth={1.5} />

            {/* Notification badge */}
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              1
            </span>

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-neutral-950"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-neutral-950 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-light">Mouhajer Assistant</h3>
                  <p className="text-xs text-white/60">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === 'assistant' ? 'bg-neutral-950 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <User className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'assistant'
                      ? 'bg-white text-neutral-900'
                      : 'bg-neutral-950 text-white'
                  }`}>
                    <div className="text-sm font-light leading-relaxed whitespace-pre-line">
                      {renderMessageWithLinks(message.content)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Bot className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="h-2 w-2 rounded-full bg-neutral-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-neutral-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="h-2 w-2 rounded-full bg-neutral-400"
                    />
                  </div>
                </motion.div>
              )}

              {/* Quick actions (show when no messages) */}
              {messages.length <= 1 && !isTyping && (
                <div className="grid grid-cols-2 gap-2 pt-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-sm font-light transition-all hover:border-neutral-300 hover:shadow-md"
                    >
                      <span className="mr-2">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-neutral-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-light outline-none transition-colors focus:border-neutral-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-white transition-all hover:bg-neutral-900 disabled:opacity-30"
                >
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
