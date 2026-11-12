/**
 * ChatMessages.jsx
 * Scrollable conversation container handling auto-scrolling,
 * the welcome empty-state screen, and typing indicators.
 */

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import { SparklesIcon, BotIcon, AlertCircleIcon, RefreshCwIcon } from '../Icons';

export default function ChatMessages({
  messages,
  isStreaming,
  isSessionReady,
  onSelectSuggestion,
  errorNotice,
  rateLimitNotice,
  limitReached,
  onStartNewSession,
}) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or stream updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  // Check if we are waiting for the first assistant token
  const lastMessage = messages[messages.length - 1];
  const isAwaitingFirstChunk =
    isStreaming && (!lastMessage || lastMessage.role === 'user');

  return (
    <div className="chat-messages-container">
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 && (
        <div className="chat-welcome-state">
          <div className="welcome-icon-box">
            <SparklesIcon size={32} />
          </div>
          <h3 className="welcome-title">Ask Karthik</h3>
          <p className="welcome-subtitle">
            Welcome! I am Karthik&apos;s digital AI representative. Ask me anything
            about his background, engineering education, skills, projects, or
            ThoughtWorks apprenticeship.
          </p>

          <SuggestedQuestions
            onSelect={onSelectSuggestion}
            disabled={!isSessionReady || isStreaming}
          />
        </div>
      )}

      {/* Conversation Thread */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Typing Indicator while waiting for first response chunk */}
      {isAwaitingFirstChunk && (
        <div className="typing-indicator-row">
          <div className="message-avatar assistant">
            <BotIcon size={18} />
          </div>
          <div className="typing-bubble" aria-label="Ask Karthik is thinking">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}

      {/* Banners for Warnings / Limits */}
      {rateLimitNotice && (
        <div className="chat-notice-banner rate-limit" role="alert">
          <span className="notice-banner-text">
            <AlertCircleIcon size={16} />
            <span>{rateLimitNotice}</span>
          </span>
        </div>
      )}

      {limitReached && (
        <div className="chat-notice-banner limit-reached" role="alert">
          <span className="notice-banner-text">
            <AlertCircleIcon size={16} />
            <span>Conversation limit reached.</span>
          </span>
          <button
            type="button"
            onClick={onStartNewSession}
            className="notice-banner-action"
          >
            Start New Session →
          </button>
        </div>
      )}

      {errorNotice && !limitReached && (
        <div className="chat-notice-banner error" role="alert">
          <span className="notice-banner-text">
            <AlertCircleIcon size={16} />
            <span>{errorNotice}</span>
          </span>
          {onStartNewSession && (
            <button
              type="button"
              onClick={onStartNewSession}
              className="notice-banner-action"
            >
              Reset Session
            </button>
          )}
        </div>
      )}

      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
}

