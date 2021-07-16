import { action, observable } from 'mobx';
import { hotKeys } from '../common/HotKeys';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public guiVis = GuiVisibility.OPEN;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
  }

  @action public toggleGuiVisibility = () => {
    if (this.guiVis === GuiVisibility.OPEN) {
      this.guiVis = GuiVisibility.CLOSED;
    } else {
      this.guiVis = GuiVisibility.OPEN;
    }
  };
}
