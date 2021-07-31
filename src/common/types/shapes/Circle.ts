import { EditorUtils } from '../../../scene/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultCircleRadius = 5;

export class Circle extends Shape {
  public radius = defaultCircleRadius;

  public checkCollision(beater: Beater) {
    const collides = PlayerUtils.circleToCircleCollision(beater, this);
    if (collides) {
      this.playSound(beater);
    }
  }

  protected buildMesh() {
    this.mesh = EditorUtils.createCircleMesh(defaultCircleRadius, this.id);
  }

  protected playSound(beater: Beater) {}

  public setScale(scale: number) {
    super.setScale(scale);

    this.radius *= scale;
  }
}
