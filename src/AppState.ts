import { action, observable } from 'mobx';
import { eventManager, EventType } from './common/EventManager';
import { GameEditor } from './scene/GameEditor';
import { GameScene } from './scene/GameScene';
import { GamePlayer } from './scene/player/GamePlayer';

export enum GameMode {
  EDIT = 'edit',
  PLAY = 'play',
}

export class AppState {
  @observable public gameMode = GameMode.EDIT;
  private readonly gameScene: GameScene;
  private readonly gameEditor: GameEditor;
  private gamePlayer?: GamePlayer;

  constructor() {
    this.gameScene = new GameScene();
    this.gameEditor = new GameEditor(this.gameScene);

    // Activate the editor by default
    this.gameEditor.activate();

    // Set scene update loop to editor
    this.gameScene.setUpdateLoop(this.gameEditor.update);

    // Start rolling
    this.gameScene.start();
  }

  @action public playGame() {
    console.log('playGame');
    if (this.gameMode === GameMode.PLAY) {
      return;
    }

    this.gameMode = GameMode.PLAY;
    eventManager.fire({ e: EventType.CHANGE_GAME_MODE, mode: this.gameMode });

    // TODO - check if any edits were made, can avoid re-making player

    // Make a new game player or reset it if no edits made
    this.gamePlayer = new GamePlayer(this.gameEditor.shapes, this.gameScene.screenLimits);

    // Swap update loop in scene to player
    this.gameScene.setUpdateLoop(this.gamePlayer.update);
  }

  @action public stopGame() {
    console.log('stopGame');
    if (this.gameMode === GameMode.EDIT || !this.gamePlayer) {
      return;
    }

    this.gameMode = GameMode.EDIT;
    eventManager.fire({ e: EventType.CHANGE_GAME_MODE, mode: this.gameMode });

    // Stop the player
    this.gamePlayer.stopPlayer();

    // Swap update loop in scene to editor
    this.gameScene.setUpdateLoop(this.gameEditor.update);
  }
}
