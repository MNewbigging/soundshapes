export enum EventType {
  ADD_BEATER = 'add-beater',
  CANCEL_ADD = 'cancel-add',
}

type EventListener = () => void;

class EventManager {
  private readonly listeners = new Map<EventType, EventListener[]>();

  public registerEventListener(event: EventType, listener: EventListener) {
    const currentListeners: EventListener[] = this.listeners.get(event) ?? [];
    currentListeners.push(listener);
    this.listeners.set(event, currentListeners);
  }

  public fire(event: EventType) {
    const eventListeners = this.listeners.get(event) ?? [];
    if (eventListeners.length) {
      eventListeners.forEach((el) => el());
    }
  }
}

export const eventManager = new EventManager();
