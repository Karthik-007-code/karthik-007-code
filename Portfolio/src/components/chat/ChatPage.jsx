/**
 * ChatPage.jsx
 * Dedicated Ask Karthik Page view.
 */

import { useChat } from '../../hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ArrowLeftIcon } from '../Icons';
import '../../styles/chat.css';

export default function ChatPage({ onBackToPortfolio }) {
  const {
    messages,
    connectionStatus,
    isSessionReady,
    isStreaming,
    errorNotice,
    rateLimitNotice,
    limitReached,
    sendMessage,
    startNewSession,
    retryConnection,
  } = useChat();

  const handleSelectSuggestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="chat-page-wrapper">
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          if (onBackToPortfolio) onBackToPortfolio();
        }}
        className="back-portfolio-link"
        aria-label="Back to Portfolio Overview"
      >
        <ArrowLeftIcon size={14} />
        <span>Back to Portfolio Overview</span>
      </a>

      <div className="chat-card">
        <ChatHeader
          connectionStatus={connectionStatus}
          isSessionReady={isSessionReady}
          onRetryConnection={retryConnection}
          onStartNewSession={startNewSession}
        />

        <ChatMessages
          messages={messages}
          isStreaming={isStreaming}
          isSessionReady={isSessionReady}
          onSelectSuggestion={handleSelectSuggestion}
          errorNotice={errorNotice}
          rateLimitNotice={rateLimitNotice}
          limitReached={limitReached}
          onStartNewSession={startNewSession}
        />

        <ChatInput
          onSendMessage={sendMessage}
          disabled={!isSessionReady || limitReached}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}

