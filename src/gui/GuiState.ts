import { action, observable } from 'mobx';
import { eventManager, EventType } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { ShapeType } from '../common/types/Shapes';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public guiVis = GuiVisibility.OPEN;
  @observable public helpDialogOpen = false;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
    eventManager.registerEventListener(EventType.CANCEL_ADD, this.showGui);
    eventManager.registerEventListener(EventType.ADD_SHAPE, this.showGui);
  }

  public addBeater() {
    this.hideGui();
    eventManager.fire({ e: EventType.START_ADD_SHAPE, shapeType: ShapeType.BEATER });
  }

  @action public showHelp() {
    this.helpDialogOpen = true;
  }

  @action public closeHelp() {
    this.helpDialogOpen = false;
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
