/**
 * useChat.js
 * React hook managing the reactive chat state and WebSocket connection.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatSocket } from '../services/chatSocket';
import { CHAT_CONFIG } from '../config/chatConfig';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [rateLimitNotice, setRateLimitNotice] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [sessionNotice, setSessionNotice] = useState(null);

  const socketRef = useRef(null);

  // Initialize and bind socket
  useEffect(() => {
    const socket = new ChatSocket(CHAT_CONFIG.wsUrl);
    socketRef.current = socket;

    const unsubs = [
      socket.on('statusChange', (status) => {
        setConnectionStatus(status);
        if (status === 'connected') {
          setErrorNotice(null);
        }
      }),

      socket.on('sessionReady', (ready) => {
        setIsSessionReady(ready);
        if (ready) {
          setErrorNotice(null);
          setRateLimitNotice(null);
        }
      }),

      socket.on('sessionReadyMessage', (msg) => {
        setSessionNotice(msg);
      }),

      socket.on('chunk', (chunkText) => {
        setIsStreaming(true);
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          const lastMsg = prev[lastIndex];

          // If the last message is already an in-progress assistant message, append chunk
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'streaming') {
            const updated = [...prev];
            updated[lastIndex] = {
              ...lastMsg,
              content: lastMsg.content + chunkText,
            };
            return updated;
          }

          // Otherwise, start a new assistant response bubble
          return [
            ...prev,
            {
              id: 'ast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
              role: 'assistant',
              content: chunkText,
              status: 'streaming',
              timestamp: Date.now(),
            },
          ];
        });
      }),

      socket.on('streamEnd', () => {
        setIsStreaming(false);
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          const lastMsg = prev[lastIndex];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'streaming') {
            const updated = [...prev];
            updated[lastIndex] = {
              ...lastMsg,
              status: 'complete',
            };
            return updated;
          }
          return prev;
        });
      }),

      socket.on('error', (err) => {
        setIsStreaming(false);
        setErrorNotice(err.message || 'An error occurred.');

        // Mark any currently streaming message as interrupted rather than dropping it
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          const lastMsg = prev[lastIndex];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'streaming') {
            const updated = [...prev];
            updated[lastIndex] = {
              ...lastMsg,
              status: 'interrupted',
            };
            return updated;
          }
          return prev;
        });
      }),

      socket.on('rateLimited', (payload) => {
        setIsStreaming(false);
        setRateLimitNotice(payload.message);
      }),

      socket.on('limitReached', (payload) => {
        setIsStreaming(false);
        setLimitReached(true);
        setErrorNotice(payload.message);
      }),

      socket.on('maxRetriesReached', () => {
        setErrorNotice(
          'Could not connect to Ask Karthik backend. Please check your internet or retry manually.'
        );
      }),
    ];

    // Initiate connection
    socket.connect();

    return () => {
      unsubs.forEach((unsub) => unsub());
      socket.disconnect();
    };
  }, []);

  // Send message handler
  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      if (trimmed.length > CHAT_CONFIG.maxMessageLength) {
        setErrorNotice(`Message exceeds maximum limit of ${CHAT_CONFIG.maxMessageLength} characters.`);
        return false;
      }
      if (isStreaming) {
        return false;
      }
      if (!isSessionReady || !socketRef.current) {
        setErrorNotice('Waiting for Ask Karthik connection...');
        return false;
      }

      setErrorNotice(null);
      setRateLimitNotice(null);

      // Append user message immediately to the UI
      const userMsg = {
        id: 'usr-' + Date.now(),
        role: 'user',
        content: trimmed,
        status: 'complete',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      try {
        socketRef.current.sendMessage(trimmed);
        return true;
      } catch (err) {
        setIsStreaming(false);
        setErrorNotice(err.message || 'Failed to send message.');
        return false;
      }
    },
    [isStreaming, isSessionReady]
  );

  // Start fresh conversation (re-connects and clears memory)
  const startNewSession = useCallback(() => {
    setMessages([]);
    setErrorNotice(null);
    setRateLimitNotice(null);
    setLimitReached(false);
    setIsStreaming(false);
    if (socketRef.current) {
      socketRef.current.manualReconnect();
    }
  }, []);

  // Manual retry connection
  const retryConnection = useCallback(() => {
    setErrorNotice(null);
    if (socketRef.current) {
      socketRef.current.manualReconnect();
    }
  }, []);

  return {
    messages,
    connectionStatus,
    isSessionReady,
    isStreaming,
    errorNotice,
    rateLimitNotice,
    limitReached,
    sessionNotice,
    sendMessage,
    startNewSession,
    retryConnection,
  };
}

