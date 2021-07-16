import { action, observable } from 'mobx';
import { eventManager, EventType } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public guiVis = GuiVisibility.OPEN;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
    eventManager.registerEventListener(EventType.ADD_BEATER, this.hideGui);
    eventManager.registerEventListener(EventType.CANCEL_ADD, this.showGui);
  }

  public addBeater() {
    console.log('addbeater');
    eventManager.fire(EventType.ADD_BEATER);
  }

  @action private readonly toggleGuiVisibility = () => {
    if (this.guiVis === GuiVisibility.OPEN) {
      this.guiVis = GuiVisibility.CLOSED;
    } else {
      this.guiVis = GuiVisibility.OPEN;
    }
  };

  private readonly hideGui = () => {
    if (this.guiVis === GuiVisibility.OPEN) {
      this.guiVis = GuiVisibility.CLOSED;
    }
  };

  private readonly showGui = () => {
    if (this.guiVis === GuiVisibility.CLOSED) {
      this.guiVis = GuiVisibility.OPEN;
    }
  };
}
