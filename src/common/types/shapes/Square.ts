import { EditorUtils } from '../../../scene/editor/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { STSquare } from '../../../sound/STSquare';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultSquareSize = 10;

export class Square extends Shape {
  public size = defaultSquareSize;
  private sound = new STSquare();

  protected buildMesh() {
    this.mesh = EditorUtils.createSquareMesh(defaultSquareSize, this.id);
  }

  protected playSound(beater: Beater) {
    this.sound.triggerImpact(this.scale, beater.speed, beater.effects);
  }

  public checkCollision(beater: Beater) {
    const collides = PlayerUtils.circleToSquareCollision(beater, this);
    if (collides) {
      this.playSound(beater);
    }
  }

  public setScale(scale: number) {
    super.setScale(scale);
    this.size *= scale;
  }
}
