/**
 * chatConfig.js
 * Centralized configuration for the Ask Karthik chatbot frontend.
 */

export const CHAT_CONFIG = {
  // WebSocket endpoint from environment variable with fallback
  wsUrl:
    import.meta.env.VITE_CHAT_WS_URL ||
    'wss://portfolio-chat-ai.onrender.com/ws/chat',

  // Maximum character limit enforced before sending
  maxMessageLength: 1000,

  // Assistant persona details
  assistantName: 'Ask Karthik',
  assistantRole: 'AI Representative',
  assistantTagline:
    "Your AI-powered guide to Karthik's background, technical skills, projects, and experience.",

  // Configurable starter questions
  suggestedQuestions: [
    'Tell me about Karthik.',
    'What are his technical skills?',
    'Explain his major projects.',
    'What is his experience with AI and ML?',
    'Tell me about his ThoughtWorks apprenticeship.',
  ],

  // Reconnection configuration
  reconnect: {
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    maxRetries: 5,
  },
};

