import { GameEditor } from './scene/GameEditor';
import { GamePlayer } from './scene/GamePlayer';
import { GameScene } from './scene/GameScene';

export enum GameMode {
  EDIT = 'edit',
  PLAY = 'play',
}

export class AppState {
  private GameMode = GameMode.EDIT;
  private readonly gameScene: GameScene;
  private readonly gameEditor: GameEditor;
  private readonly gamePlayer?: GamePlayer;

  constructor() {
    this.gameScene = new GameScene();
    this.gameEditor = new GameEditor(this.gameScene);

    // Assign update loop for the game
    this.gameScene.setUpdateLoop(this.gameEditor.update);

    // Start game
    this.gameScene.start();
  }
}
