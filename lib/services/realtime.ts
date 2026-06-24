/**
 * realtime.ts — Tiny typed event emitter for UnifyFlow in-app realtime events.
 *
 * Used to notify components (e.g. the process map) when events occur
 * (e.g. "interview:completed").
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (payload: any) => void;

export class EventEmitter {
  private handlers: Map<string, Set<Handler>> = new Map();

  /** Subscribe to an event. */
  on(event: string, handler: Handler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /** Unsubscribe from an event. */
  off(event: string, handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }

  /** Emit an event with a payload to all subscribed handlers. */
  emit(event: string, payload: unknown): void {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }
}

/** Singleton realtime emitter instance for app-wide use. */
export const realtime = new EventEmitter();
