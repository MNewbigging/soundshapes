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

  protected playSound() {
    /**
     * You could either pass super properties for the sound
     * Or, put all logic for playing the specific sound in here
     * and we'll leave super blank.
     */
    super.playSound();
  }

  public checkCollision(beater: Beater) {
    const collides = PlayerUtils.circleToSquareCollision(beater, this);
    if (collides) {
      this.playSound();
    }
  }
}
