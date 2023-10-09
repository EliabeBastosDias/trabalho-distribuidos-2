import { EventHandler } from "../events/event.handler";
import { EventEntity } from "../interfaces/event.interface";

const events: EventEntity[] = [];

export const eventHandler = EventHandler.getInstance(events);