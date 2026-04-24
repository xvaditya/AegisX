/* ── useWebSocket Hook ── */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient, type WSMessageHandler } from '../services/websocket';
import { WS_BASE_URL } from '../utils/constants';

export function useWebSocket(path: string) {
  const clientRef = useRef<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const subscribe = useCallback((handler: WSMessageHandler) => {
    if (!clientRef.current) return () => {};
    return clientRef.current.subscribe(handler);
  }, []);

  useEffect(() => {
    const client = new WebSocketClient(`${WS_BASE_URL}${path}`);
    clientRef.current = client;

    // Track connection status
    const checkInterval = setInterval(() => {
      setIsConnected(client.isConnected);
    }, 1000);

    client.connect();

    return () => {
      clearInterval(checkInterval);
      client.disconnect();
      clientRef.current = null;
    };
  }, [path]);

  return { isConnected, subscribe };
}
