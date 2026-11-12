/**
 * ChatInput.jsx
 * Expanding textarea with Enter-to-send, character limit counter,
 * and streaming state disablement.
 */

import { useState, useRef, useEffect } from 'react';
import { SendIcon } from '../Icons';
import { CHAT_CONFIG } from '../../config/chatConfig';

export default function ChatInput({ onSendMessage, disabled = false, isStreaming = false }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const maxLength = CHAT_CONFIG.maxMessageLength;

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    // Send on Enter (unless Shift is pressed for multiline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || isStreaming) return;

    const sent = onSendMessage(trimmed);
    if (sent) {
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const charCount = text.length;
  const isWarning = charCount > maxLength * 0.8;
  const isDanger = charCount >= maxLength;

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Connecting to Ask Karthik...'
              : isStreaming
              ? 'Ask Karthik is replying...'
              : 'Ask a question about Karthik... (Press Enter to send)'
          }
          disabled={disabled || isStreaming}
          rows={1}
          className="chat-textarea"
          aria-label="Ask a question about Karthik"
        />

        <div className="chat-input-actions">
          {charCount > 0 && (
            <span
              className={`char-counter ${isDanger ? 'is-danger' : isWarning ? 'is-warning' : ''}`}
            >
              {charCount}/{maxLength}
            </span>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || isStreaming || !text.trim()}
            className="chat-send-btn"
            aria-label="Send message"
            title="Send (Enter)"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>

      <div className="chat-disclaimer">
        <span>Press <kbd style={{ fontFamily: 'var(--font-mono)' }}>Enter</kbd> to send, <kbd style={{ fontFamily: 'var(--font-mono)' }}>Shift+Enter</kbd> for newline</span>
        <span>Verified AI Representative</span>
      </div>
    </div>
  );
}

