import { adminAuth } from "@/lib/firebaseAdmin";
import { log } from "@/lib/logger";
import type { WebSocket } from "ws";
import type { IncomingMessage } from "http";

export interface AuthenticatedWebSocket extends WebSocket {
  uid?: string;
  email?: string;
  isAuthenticated?: boolean;
}

export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

/**
 * Verify WebSocket Bearer token
 */
export async function verifyWebSocketToken(
  token: string,
): Promise<{ uid: string; email?: string } | null> {
  try {
    if (!token) {
      log.warn("No token provided for WebSocket");
      return null;
    }

    const decodedToken = await adminAuth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    log.warn("Failed to verify WebSocket token", error);
    return null;
  }
}

/**
 * Extract token from WebSocket upgrade request
 */
export function getTokenFromWebSocketRequest(
  req: IncomingMessage,
): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

/**
 * Authenticate WebSocket connection
 */
export async function authenticateWebSocket(
  ws: AuthenticatedWebSocket,
  req: IncomingMessage,
): Promise<boolean> {
  try {
    const token = getTokenFromWebSocketRequest(req);

    if (!token) {
      log.warn("WebSocket connection attempt without token");
      ws.close(4001, "Unauthorized: Missing token");
      return false;
    }

    const auth = await verifyWebSocketToken(token);

    if (!auth) {
      log.warn("WebSocket token verification failed");
      ws.close(4001, "Unauthorized: Invalid token");
      return false;
    }

    ws.uid = auth.uid;
    ws.email = auth.email;
    ws.isAuthenticated = true;

    log.info("WebSocket authenticated", { uid: auth.uid });
    return true;
  } catch (error) {
    log.error("WebSocket authentication error", error);
    ws.close(4000, "Internal server error");
    return false;
  }
}

/**
 * Send authenticated message to WebSocket client
 */
export function sendWebSocketMessage(
  ws: AuthenticatedWebSocket,
  type: string,
  data: Record<string, unknown>,
): void {
  if (ws.readyState !== 1) {
    // 1 = WebSocket.OPEN
    return;
  }

  const message: WebSocketMessage = {
    type,
    data,
    timestamp: Date.now(),
  };

  ws.send(JSON.stringify(message));
}

/**
 * Broadcast message to multiple WebSocket clients
 */
export function broadcastWebSocketMessage(
  clients: Set<AuthenticatedWebSocket>,
  type: string,
  data: Record<string, unknown>,
  filter?: (ws: AuthenticatedWebSocket) => boolean,
): void {
  const message: WebSocketMessage = {
    type,
    data,
    timestamp: Date.now(),
  };

  const messageStr = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === 1 && (!filter || filter(client))) {
      client.send(messageStr);
    }
  });
}

/**
 * Send error message to WebSocket client
 */
export function sendWebSocketError(
  ws: AuthenticatedWebSocket,
  errorType: string,
  message: string,
  code?: number,
): void {
  sendWebSocketMessage(ws, "error", {
    type: errorType,
    message,
    code: code || 500,
  });
}

export function validateWebSocketMessage(
  message: unknown,
): message is WebSocketMessage {
  return Boolean(
    message &&
    typeof message === "object" &&
    typeof (message as WebSocketMessage).type === "string" &&
    typeof (message as WebSocketMessage).data === "object",
  );
}

/**
 * Handle WebSocket disconnection cleanup
 */
export function handleWebSocketDisconnect(
  ws: AuthenticatedWebSocket,
  clients: Set<AuthenticatedWebSocket>,
): void {
  clients.delete(ws);

  if (ws.isAuthenticated && ws.uid) {
    log.info("WebSocket client disconnected", { uid: ws.uid });
  }
}

/**
 * Create WebSocket connection handler
 */
export function createWebSocketHandler(
  onMessage: (
    ws: AuthenticatedWebSocket,
    message: WebSocketMessage,
  ) => Promise<void>,
  onError?: (ws: AuthenticatedWebSocket, error: Error) => void,
) {
  const clients = new Set<AuthenticatedWebSocket>();

  return {
    authenticateAndAdd: async (
      ws: AuthenticatedWebSocket,
      req: IncomingMessage,
    ): Promise<boolean> => {
      const authenticated = await authenticateWebSocket(ws, req);
      if (authenticated) {
        clients.add(ws);
      }
      return authenticated;
    },

    handleMessage: async (ws: AuthenticatedWebSocket, rawMessage: string) => {
      try {
        const message = JSON.parse(rawMessage);

        if (!validateWebSocketMessage(message)) {
          sendWebSocketError(
            ws,
            "INVALID_MESSAGE",
            "Message format is invalid",
          );
          return;
        }

        await onMessage(ws, message);
      } catch (error) {
        log.error("WebSocket message handling error", error);
        if (onError && error instanceof Error) {
          onError(ws, error);
        } else {
          sendWebSocketError(ws, "INTERNAL_ERROR", "Failed to process message");
        }
      }
    },

    handleDisconnect: (ws: AuthenticatedWebSocket) => {
      handleWebSocketDisconnect(ws, clients);
    },

    getClients: () => clients,

    broadcast: (
      type: string,
      data: Record<string, unknown>,
      filter?: (ws: AuthenticatedWebSocket) => boolean,
    ) => {
      broadcastWebSocketMessage(clients, type, data, filter);
    },
  };
}
