type KeyListener = () => void;

class HotKeys {
  private readonly keysPressed = new Set<string>();
  private readonly listeners = new Map<string, KeyListener[]>();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  public registerHotKeyListener(key: string, listener: KeyListener) {
    const currentListeners: KeyListener[] = this.listeners.get(key) ?? [];
    currentListeners.push(listener);
    this.listeners.set(key, currentListeners);
  }

  private readonly onKeyDown = (e: KeyboardEvent) => {
    console.log('pressed key: ', e.key);
    // Only trigger callback for this key first frame it is pressed/held
    if (this.keysPressed.has(e.key)) {
      return;
    }

    this.keysPressed.add(e.key);
    this.callKeyListeners(e.key);
  };

  private callKeyListeners(key: string) {
    const keyListeners: KeyListener[] = this.listeners.get(key) ?? [];
    if (keyListeners.length) {
      keyListeners.forEach((kl) => kl());
    }
  }

  private readonly onKeyUp = (e: KeyboardEvent) => {
    this.keysPressed.delete(e.key);
  };
}

export const hotKeys = new HotKeys();
