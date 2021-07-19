import { EditorUtils } from '../../../scene/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultSquareSize = 10;

export class Square extends Shape {
  public size = defaultSquareSize;

  protected buildMesh() {
    this.mesh = EditorUtils.createSquareMesh(defaultSquareSize);
  }

  public checkCollision(beater: Beater) {
    PlayerUtils.circleToSquareCollision(beater, this);
  }
}
