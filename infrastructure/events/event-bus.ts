export type DomainEvent = 
  | { type: "POST_PUBLISHED"; payload: { postId: string; slug: string; tenantId: string } }
  | { type: "SUBSCRIPTION_UPGRADED"; payload: { tenantId: string; plan: string } }
  | { type: "COMMENT_CREATED"; payload: { commentId: string; postId: string } };

type EventListener = (event: DomainEvent) => void | Promise<void>;

/**
 * Global Event Bus: Decoupled pub/sub domain events dispatcher.
 */
class DistributedEventBus {
  private listeners: Record<string, EventListener[]> = {};

  /**
   * Register event listener subscriber.
   */
  subscribe(type: DomainEvent["type"], callback: EventListener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  /**
   * Broadcast/publish domain event to subscribers.
   */
  async publish(event: DomainEvent) {
    console.log(`[Event Bus] Dispatching event: ${event.type}`, event.payload);
    
    const callbacks = this.listeners[event.type] || [];
    await Promise.all(
      callbacks.map(async (cb) => {
        try {
          await cb(event);
        } catch (err) {
          console.error(`[Event Bus] Listener execution failed for event ${event.type}`, err);
        }
      })
    );
  }
}

export const eventBus = new DistributedEventBus();
