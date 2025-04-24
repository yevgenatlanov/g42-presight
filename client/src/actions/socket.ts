import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket) return;

    this.socket = io("http://localhost:3001");

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Set up event listeners from the map
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
    });
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);

    // adding listner if socket already exist
    if (this.socket) {
      this.socket.on(event, callback as any);
    }

    // return a function to remove this listener
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (this.socket) {
          this.socket.off(event, callback as any);
        }
      }
    };
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit(event, data);
  }
}

export const socketService = new SocketService();
