import { EventEntity } from "../interfaces/event.interface";

export class EventHandler {
  private static instance: EventHandler;

  public static getInstance(events: EventEntity[]): EventHandler {
    if (!EventHandler.instance) {
      const instance = new EventHandler(events);
      EventHandler.instance = instance;
    }
    return EventHandler.instance;
  }

  private constructor(private events: EventEntity[]) {}

  public storeEvent(event: EventEntity): void {
    this.events.push(event);
  }

  public getFirstEvent(): EventEntity | undefined {
    if (this.events.length) return this.events.shift();
    return;
  }
}
