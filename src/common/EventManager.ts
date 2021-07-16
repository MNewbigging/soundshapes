import { Shape } from './types/Shapes';

export enum EventType {
  START_ADD_SHAPE = 'start-add-shape',
  ADD_SHAPE = 'add-shape',
  CANCEL_ADD = 'cancel-add',
}

export interface EventParams {
  shape?: Shape;
}

type EventListener = (eventParams?: EventParams) => void;

class EventManager {
  private readonly listeners = new Map<EventType, EventListener[]>();

  public registerEventListener(event: EventType, listener: EventListener) {
    const currentListeners: EventListener[] = this.listeners.get(event) ?? [];
    currentListeners.push(listener);
    this.listeners.set(event, currentListeners);
  }

  public fire(event: EventType, params?: EventParams) {
    const eventListeners = this.listeners.get(event) ?? [];
    if (eventListeners.length) {
      console.log('firing event: ', event);
      eventListeners.forEach((el) => el(params));
    }
  }
}

export const eventManager = new EventManager();
