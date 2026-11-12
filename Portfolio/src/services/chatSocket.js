/**
 * chatSocket.js
 * Standalone WebSocket communication service for Ask Karthik.
 *
 * Adheres strictly to the backend message contract:
 * - Outgoing: { "message": "string" }
 * - Incoming:
 *   - { "type": "session_ready", "message": "..." }
 *   - { "type": "chunk", "content": "..." }
 *   - { "type": "stream_end" }
 *   - { "type": "error", "message": "..." }
 *   - { "type": "rate_limited", "message": "..." }
 *   - { "type": "limit_reached", "message": "..." }
 */

import { CHAT_CONFIG } from '../config/chatConfig';

export class ChatSocket {
  constructor(url = CHAT_CONFIG.wsUrl) {
    this.url = url;
    this.socket = null;
    this.status = 'disconnected'; // 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'
    this.isSessionReady = false;
    this.retryCount = 0;
    this.reconnectTimer = null;
    this.listeners = new Map();
    this.explicitClose = false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.emit('statusChange', newStatus);
    }
  }

  connect() {
    // If already open or connecting, do nothing
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.explicitClose = false;
    this.isSessionReady = false;
    this.setStatus(this.retryCount > 0 ? 'reconnecting' : 'connecting');

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        // Connected to socket layer, but waiting for session_ready
        this.retryCount = 0;
        this.setStatus('connected');
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.warn('[ChatSocket] Socket encountered an error:', error);
        this.setStatus('error');
        this.emit('error', {
          type: 'network_error',
          message: 'Unable to reach the Ask Karthik service.',
        });
      };

      this.socket.onclose = (event) => {
        this.isSessionReady = false;
        this.emit('sessionReady', false);

        if (this.explicitClose) {
          this.setStatus('disconnected');
          return;
        }

        console.info(
          `[ChatSocket] Closed (code=${event.code}, reason=${event.reason || 'none'})`
        );
        this.handleAutoReconnect();
      };
    } catch (err) {
      console.error('[ChatSocket] Failed to create WebSocket:', err);
      this.setStatus('error');
      this.handleAutoReconnect();
    }
  }

  handleMessage(rawText) {
    let payload;
    try {
      payload = JSON.parse(rawText);
    } catch (e) {
      console.warn('[ChatSocket] Received non-JSON frame:', rawText);
      return;
    }

    const { type, content, message } = payload;

    switch (type) {
      case 'session_ready':
        this.isSessionReady = true;
        this.emit('sessionReady', true);
        this.emit('sessionReadyMessage', message || 'Connected to Ask Karthik.');
        break;

      case 'chunk':
        // Assistant streaming token chunk
        if (typeof content === 'string') {
          this.emit('chunk', content);
        }
        break;

      case 'stream_end':
        // Streaming finished
        this.emit('streamEnd');
        break;

      case 'error':
        this.emit('error', {
          type: 'backend_error',
          message: message || 'An unexpected error occurred.',
        });
        break;

      case 'rate_limited':
        this.emit('rateLimited', {
          message:
            message ||
            'You are sending messages too quickly. Please pause for a moment.',
        });
        break;

      case 'limit_reached':
        this.emit('limitReached', {
          message:
            message ||
            'Session conversation turn limit reached. Please start a new session.',
        });
        break;

      default:
        console.info('[ChatSocket] Unknown frame type received:', payload);
        break;
    }
  }

  sendMessage(text) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected.');
    }
    if (!this.isSessionReady) {
      throw new Error('Backend session is not ready yet.');
    }

    const payload = JSON.stringify({ message: text });
    this.socket.send(payload);
  }

  handleAutoReconnect() {
    if (this.explicitClose) return;

    if (this.retryCount >= CHAT_CONFIG.reconnect.maxRetries) {
      console.warn('[ChatSocket] Maximum reconnection attempts reached.');
      this.setStatus('disconnected');
      this.emit('maxRetriesReached');
      return;
    }

    this.setStatus('reconnecting');
    this.retryCount += 1;

    // Exponential backoff
    const delay = Math.min(
      CHAT_CONFIG.reconnect.initialDelayMs * Math.pow(2, this.retryCount - 1),
      CHAT_CONFIG.reconnect.maxDelayMs
    );

    console.info(
      `[ChatSocket] Reconnecting in ${delay}ms (attempt ${this.retryCount}/${CHAT_CONFIG.reconnect.maxRetries})`
    );

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  manualReconnect() {
    clearTimeout(this.reconnectTimer);
    this.retryCount = 0;
    this.disconnect();
    this.connect();
  }

  disconnect() {
    this.explicitClose = true;
    clearTimeout(this.reconnectTimer);

    if (this.socket) {
      try {
        this.socket.close();
      } catch (e) {
        // ignore
      }
      this.socket = null;
    }

    this.isSessionReady = false;
    this.setStatus('disconnected');
  }
}

