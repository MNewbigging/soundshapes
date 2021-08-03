import { EditorUtils } from '../../../scene/editor/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { STCircle } from '../../../sound/STCircle';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultCircleRadius = 5;

export class Circle extends Shape {
  public radius = defaultCircleRadius;
  private sound = new STCircle();

  public checkCollision(beater: Beater) {
    const collides = PlayerUtils.circleToCircleCollision(beater, this);
    if (collides) {
      this.playSound(beater);
    }
  }

  protected buildMesh() {
    this.mesh = EditorUtils.createCircleMesh(defaultCircleRadius, this.id);
  }

  protected playSound(beater: Beater) {
    this.sound.triggerImpact(this.radius, beater.speed, beater.effects);
  }

  public setScale(scale: number) {
    super.setScale(scale);

    this.radius *= scale;
  }
}
