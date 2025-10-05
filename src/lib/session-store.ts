import { CheckoutSession } from "./acp-types";

// In-memory session store (for demo purposes)
// In production, use a database like Redis or PostgreSQL
const sessions = new Map<string, CheckoutSession>();

export function createSession(session: CheckoutSession): void {
  sessions.set(session.id, session);
}

export function getSession(id: string): CheckoutSession | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, session: CheckoutSession): void {
  sessions.set(id, session);
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}
