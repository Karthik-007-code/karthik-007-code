/**
 * ChatHeader.jsx
 * Header for the Ask Karthik chatbot showing the AI persona,
 * connection status, and session controls.
 */

import ConnectionStatus from './ConnectionStatus';
import { BotIcon, RefreshCwIcon } from '../Icons';

export default function ChatHeader({
  connectionStatus,
  isSessionReady,
  onRetryConnection,
  onStartNewSession,
}) {
  let pulseClass = '';
  if (connectionStatus === 'connected' && isSessionReady) {
    pulseClass = '';
  } else if (connectionStatus === 'reconnecting' || connectionStatus === 'connecting') {
    pulseClass = 'is-reconnecting';
  } else {
    pulseClass = 'is-offline';
  }

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-avatar-container">
          <BotIcon size={22} />
          <span className={`chat-avatar-pulse ${pulseClass}`} aria-hidden="true" />
        </div>

        <div className="chat-title-group">
          <h2>
            <span>Ask Karthik</span>
            <span className="chat-badge">AI Representative</span>
          </h2>
          <p className="chat-title-tagline">
            Powered by Groq &amp; FastAPI WebSocket Streaming
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        <ConnectionStatus
          status={connectionStatus}
          isSessionReady={isSessionReady}
          onRetry={onRetryConnection}
        />

        <button
          type="button"
          onClick={onStartNewSession}
          className="icon-btn-secondary"
          title="Start fresh conversation"
        >
          <RefreshCwIcon size={14} />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
}

