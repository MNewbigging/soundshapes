import { action, observable } from 'mobx';
import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { ShapeType } from '../common/types/Shapes';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public guiVis = GuiVisibility.OPEN;
  @observable public propsVis = GuiVisibility.CLOSED;
  @observable public helpDialogOpen = false;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
    eventManager.registerEventListener(EventType.CANCEL_ADD, this.showGui);
    eventManager.registerEventListener(EventType.ADD_SHAPE, this.showGui);
    eventManager.registerEventListener(EventType.SELECT_SHAPE, this.onSelectShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
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

    if (this.propsVis === GuiVisibility.OPEN) {
      // There is a shape selected, deselect it
      eventManager.fire({ e: EventType.DESELECT_SHAPE });
    }
  };

  @action private readonly hideGui = () => {
    if (this.guiVis === GuiVisibility.OPEN) {
      this.guiVis = GuiVisibility.CLOSED;
    }
  };

  @action private readonly showGui = () => {
    if (this.guiVis === GuiVisibility.CLOSED) {
      this.guiVis = GuiVisibility.OPEN;
    }
  };

  private readonly onSelectShape = (event: GameEvent) => {
    // Set the shape in state for toolbar to use

    // Show the toolbar if currently hidden
    if (this.propsVis === GuiVisibility.CLOSED) {
      this.propsVis = GuiVisibility.OPEN;
    }
  };

  private readonly onDeselectShape = (_event: GameEvent) => {
    // Clear the shape in state
    if (this.propsVis === GuiVisibility.OPEN) {
      this.propsVis = GuiVisibility.CLOSED;
    }
  };
}
