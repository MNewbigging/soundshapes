import { action, observable } from 'mobx';

import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Shape, ShapeType } from '../common/types/Shapes';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public guiVis = GuiVisibility.OPEN;
  @observable public propsVis = GuiVisibility.CLOSED;
  @observable public helpDialogOpen = false;
  @observable public selectedShape?: Shape;
  private closingPropsToolbar = false;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
    eventManager.registerEventListener(EventType.CANCEL_ADD, this.showGui);
    eventManager.registerEventListener(EventType.ADD_SHAPE, this.showGui);
    eventManager.registerEventListener(EventType.SELECT_SHAPE, this.onSelectShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
  }

  public addShape(shapeType: ShapeType) {
    this.hideGui();
    this.mainGuiClick();
    eventManager.fire({ e: EventType.START_ADD_SHAPE, shapeType });
  }

  @action public showHelp() {
    this.mainGuiClick();
    this.helpDialogOpen = true;
  }

  @action public closeHelp() {
    this.helpDialogOpen = false;
  }

  private mainGuiClick() {
    // When clicking anything on left or top toolbar, deselect any selected shape
    if (this.propsVis === GuiVisibility.OPEN) {
      eventManager.fire({ e: EventType.DESELECT_SHAPE });
    }
  }

  @action private readonly toggleGuiVisibility = () => {
    if (this.guiVis === GuiVisibility.OPEN) {
      this.guiVis = GuiVisibility.CLOSED;
      // If we've just turned ui off, also deselect shape
      if (this.propsVis === GuiVisibility.OPEN) {
        eventManager.fire({ e: EventType.DESELECT_SHAPE });
      }
    } else {
      this.guiVis = GuiVisibility.OPEN;
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

  @action private closePropsToolbar() {
    if (this.closingPropsToolbar) {
      this.selectedShape = undefined;
    }
  }

  @action private readonly onSelectShape = (event: GameEvent) => {
    // Set the shape in state for toolbar to use
    if (event.e === EventType.SELECT_SHAPE) {
      this.selectedShape = event.shape;
      this.closingPropsToolbar = false;
    }

    // Show the toolbar if currently hidden
    if (this.propsVis === GuiVisibility.CLOSED) {
      this.propsVis = GuiVisibility.OPEN;
    }
  };

  private readonly onDeselectShape = (_event: GameEvent) => {
    // Clear the shape in state after closing animation
    this.closingPropsToolbar = true;
    setTimeout(() => this.closePropsToolbar(), 300);

    // Close the props toolbar
    if (this.propsVis === GuiVisibility.OPEN) {
      this.propsVis = GuiVisibility.CLOSED;
    }
  };
}
