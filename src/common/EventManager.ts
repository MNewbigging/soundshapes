import { Shape } from 'three';
import { ShapeType } from './types/Shapes';

export enum EventType {
  START_ADD_SHAPE = 'start-add-shape',
  ADD_SHAPE = 'add-shape',
  CANCEL_ADD = 'cancel-add',
  SELECT_SHAPE = 'select-shape',
}

export type GameEvent =
  | { e: EventType.START_ADD_SHAPE; shapeType: ShapeType }
  | { e: EventType.ADD_SHAPE }
  | { e: EventType.CANCEL_ADD }
  | { e: EventType.SELECT_SHAPE; shape: Shape };

type EventListener = (gameEvent: GameEvent) => void;

class EventManager {
  private readonly listeners = new Map<EventType, EventListener[]>();

  public registerEventListener(event: EventType, listener: EventListener) {
    const currentListeners: EventListener[] = this.listeners.get(event) ?? [];
    currentListeners.push(listener);
    this.listeners.set(event, currentListeners);
  }

  public fire(event: GameEvent) {
    const eventListeners = this.listeners.get(event.e) ?? [];
    if (eventListeners.length) {
      console.log('firing event: ', event);
      eventListeners.forEach((el) => el(event));
    }
  }
}

export const eventManager = new EventManager();
