'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data?: unknown;
  message?: string;
  timestamp: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: unknown) => void;
  connectionError: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const didOpenRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  const resolveWebSocketUrl = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      return url;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${protocol}://${window.location.host}${normalizedPath}`;
  }, [url]);

  const connect = useCallback(() => {
    try {
      const resolvedUrl = resolveWebSocketUrl();
      if (!resolvedUrl) return;

      const ws = new WebSocket(resolvedUrl);
      didOpenRef.current = false;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        didOpenRef.current = true;
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = () => {
        if (!shouldReconnectRef.current || ws !== wsRef.current) {
          return;
        }

        // During Fast Refresh or route teardown, a socket may close before opening.
        // Treat it as transient and avoid noisy console errors.
        if (!didOpenRef.current) {
          setConnectionError('WebSocket reconnecting...');
          return;
        }

        console.warn('⚠️ WebSocket transient error. Reconnecting...');
        setConnectionError('WebSocket connection error');
      };

      ws.onclose = () => {
        if (ws !== wsRef.current) {
          return;
        }

        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        if (!shouldReconnectRef.current) {
          return;
        }

        if (reconnectAttemptsRef.current >= 10) {
          setConnectionError('WebSocket is offline after multiple retries.');
          return;
        }

        const delayMs = Math.min(10000, 1000 * Math.pow(2, reconnectAttemptsRef.current));
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`🔄 Attempting to reconnect... (${reconnectAttemptsRef.current})`);
          connectRef.current();
        }, delayMs);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect to WebSocket server');
    }
  }, [resolveWebSocketUrl]);

  useEffect(() => {
    connectRef.current = connect;
    shouldReconnectRef.current = true;
    connectRef.current();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        const socketToCleanup = wsRef.current;
        wsRef.current = null;

        socketToCleanup.onopen = null;
        socketToCleanup.onmessage = null;
        socketToCleanup.onerror = null;
        socketToCleanup.onclose = null;

        // Calling close() while CONNECTING can emit a noisy browser console warning.
        // Let the transient pre-open socket get garbage-collected during teardown.
        if (socketToCleanup.readyState === WebSocket.OPEN || socketToCleanup.readyState === WebSocket.CLOSING) {
          socketToCleanup.close(1000, 'cleanup');
        }
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connectionError,
  };
}
