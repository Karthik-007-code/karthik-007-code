/**
 * ConnectionStatus.jsx
 * Displays live WebSocket connection status and retry control.
 */

import { RefreshCwIcon } from '../Icons';

export default function ConnectionStatus({ status, isSessionReady, onRetry }) {
  let label = 'Connecting...';
  let statusClass = 'connecting';

  if (status === 'connected' && isSessionReady) {
    label = 'Ready';
    statusClass = 'connected';
  } else if (status === 'connected' && !isSessionReady) {
    label = 'Starting session...';
    statusClass = 'connecting';
  } else if (status === 'reconnecting') {
    label = 'Reconnecting...';
    statusClass = 'reconnecting';
  } else if (status === 'disconnected') {
    label = 'Disconnected';
    statusClass = 'disconnected';
  } else if (status === 'error') {
    label = 'Connection error';
    statusClass = 'error';
  }

  const showRetry = status === 'disconnected' || status === 'error';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <div className={`connection-pill ${statusClass}`} title={`Status: ${label}`}>
        <span className="status-dot" aria-hidden="true" />
        <span>{label}</span>
      </div>

      {showRetry && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="icon-btn-secondary"
          title="Retry connection"
          style={{ padding: '0.35rem 0.6rem' }}
        >
          <RefreshCwIcon size={13} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

