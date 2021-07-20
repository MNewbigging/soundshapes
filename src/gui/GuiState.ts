import { action, observable } from 'mobx';
import React from 'react';
import { GameMode } from '../AppState';

import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Shape, ShapeType } from '../common/types/shapes/Shape';

export enum GuiVisibility {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class GuiState {
  @observable public gameVis = GuiVisibility.OPEN;
  @observable public shapesVis = GuiVisibility.OPEN;
  @observable public propsVis = GuiVisibility.CLOSED;
  @observable public helpDialogOpen = false;
  @observable public selectedShape?: Shape;
  private closingPropsToolbar = false;
  private gameMode: GameMode = GameMode.EDIT;

  constructor() {
    hotKeys.registerHotKeyListener('t', this.toggleGuiVisibility);
    eventManager.registerEventListener(EventType.CANCEL_ADD, this.showAllGui);
    eventManager.registerEventListener(EventType.ADD_SHAPE, this.showAllGui);
    eventManager.registerEventListener(EventType.SELECT_SHAPE, this.onSelectShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
    eventManager.registerEventListener(EventType.CHANGE_GAME_MODE, this.onGameModeChange);
  }

  @action public showHelp() {
    // On clicking a game toolbar, deselect shape
    this.fireDeselectEvent();
    this.helpDialogOpen = true;
  }

  @action public closeHelp() {
    this.helpDialogOpen = false;
  }

  public addShape(shapeType: ShapeType, mouseEvent: React.MouseEvent) {
    // When adding a shape, hide all GUI first
    this.hideAllGui();
    eventManager.fire({ e: EventType.START_ADD_SHAPE, shapeType, mouseEvent });
  }

  private fireDeselectEvent() {
    // Only fires if necessary
    if (this.propsVis === GuiVisibility.OPEN) {
      eventManager.fire({ e: EventType.DESELECT_SHAPE });
    }
  }

  private hideAllGui() {
    this.hideShapesToolbar();
    this.hideGameToolbar();
    this.fireDeselectEvent();
  }

  private showAllGui = (_event: GameEvent) => {
    this.showShapesToolbar();
    this.showGameToolbar();
    // Cannot manually show props toolbar - must select it first
  };

  @action private readonly onGameModeChange = (event: GameEvent) => {
    if (event.e === EventType.CHANGE_GAME_MODE) {
      this.gameMode = event.mode;

      // Are we starting or stopping the game?
      if (this.gameMode === GameMode.PLAY) {
        this.fireDeselectEvent();
        this.hideShapesToolbar();
      } else {
        this.showShapesToolbar();
      }
    }
  };

  @action private hideShapesToolbar() {
    if (this.shapesVis === GuiVisibility.OPEN) {
      this.shapesVis = GuiVisibility.CLOSED;
    }
  }

  @action private showShapesToolbar() {
    if (this.shapesVis === GuiVisibility.CLOSED) {
      this.shapesVis = GuiVisibility.OPEN;
    }
  }

  @action private hideGameToolbar() {
    if (this.gameVis === GuiVisibility.OPEN) {
      this.gameVis = GuiVisibility.CLOSED;
    }
  }

  @action private showGameToolbar() {
    if (this.gameVis === GuiVisibility.CLOSED) {
      this.gameVis = GuiVisibility.OPEN;
    }
  }

  private readonly toggleGuiVisibility = () => {
    // Can always toggle the game toolbar
    this.toggleGameToolbar();

    // Other toolbars only active in edit mode
    if (this.gameMode === GameMode.EDIT) {
      this.toggleShapesToolbar();

      // Toggling deselects selected shape
      this.fireDeselectEvent();
    }
  };

  @action private toggleGameToolbar() {
    this.gameVis = this.gameVis === GuiVisibility.OPEN ? GuiVisibility.CLOSED : GuiVisibility.OPEN;
  }

  @action private toggleShapesToolbar() {
    this.shapesVis =
      this.shapesVis === GuiVisibility.OPEN ? GuiVisibility.CLOSED : GuiVisibility.OPEN;
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
    // Are we in a selected state?
    if (this.propsVis === GuiVisibility.CLOSED) {
      return;
    }

    // Clear the shape in state after closing animation
    this.closingPropsToolbar = true;
    setTimeout(() => this.closePropsToolbar(), 300);

    // Close the props toolbar
    this.propsVis = GuiVisibility.CLOSED;
  };

  @action private closePropsToolbar() {
    if (this.closingPropsToolbar) {
      this.selectedShape = undefined;
    }
  }
}
