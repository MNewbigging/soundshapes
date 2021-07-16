import { action, observable } from 'mobx';
import { hotKeys } from '../common/HotKeys';

export class GuiState {
  @observable public shapesToolbarOpen = false;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleShapesToolbar);
  }

  @action public toggleShapesToolbar = () => {
    this.shapesToolbarOpen = !this.shapesToolbarOpen;
  };
}
