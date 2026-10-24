import mongoose from 'mongoose';
import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let useMemoryStore = false;

// Check if a local host and port is reachable before attempting mongoose.connect
const isSocketReachable = (host: string, port: number, timeoutMs = 800): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(true);
      }
    });

    socket.on('timeout', () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on('error', () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(false);
      }
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
};

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.log(
      'ℹ️ MONGODB_URI is not set or contains placeholder credentials. Initializing Mongoose memory storage adapter for seamless demo & verification.'
    );
    useMemoryStore = true;
    return false;
  }

  // If pointing to localhost or 127.0.0.1, check if a local MongoDB service is actively listening
  const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1');
  if (isLocalhost) {
    const portMatch = uri.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1], 10) : 27017;
    const isReachable = await isSocketReachable('127.0.0.1', port);

    if (!isReachable) {
      console.log(
        `ℹ️ Local MongoDB daemon not active on 127.0.0.1:${port}. Utilizing persistent MERN in-memory adapter. To connect to MongoDB Atlas, set an Atlas URI in MONGODB_URI.`
      );
      useMemoryStore = true;
      return false;
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      bufferCommands: false,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`⚡ MongoDB connection unavailable (${error.message}). Running with persistent in-memory MERN adapter.`);
    useMemoryStore = true;
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isConnected,
    useMemoryStore,
    mode: isConnected ? 'MongoDB Atlas / Local' : 'In-Memory Mongoose Adapter (Zero-Config Ready)',
  };
};
