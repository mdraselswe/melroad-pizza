import { STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * Demo contact service. Messages are kept in localStorage on this device.
 * Swap `sendMessage` for an API or email-service call to deliver them to the shop.
 */

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface StoredMessage extends ContactMessage {
  sentAt: number;
}

const MAX_STORED = 20;

export function listMessages(): StoredMessage[] {
  const messages = readStorage<StoredMessage[]>(STORAGE_KEYS.messages, []);
  return Array.isArray(messages) ? messages : [];
}

export function sendMessage(input: ContactMessage, now = Date.now()): StoredMessage {
  const stored: StoredMessage = { ...input, phone: input.phone || undefined, sentAt: now };
  writeStorage(STORAGE_KEYS.messages, [stored, ...listMessages()].slice(0, MAX_STORED));
  return stored;
}
