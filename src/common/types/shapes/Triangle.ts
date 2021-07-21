import { EditorUtils } from '../../../scene/EditorUtils';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultTriangleSize = 10;

export class Triangle extends Shape {
  public size = defaultTriangleSize;

  public checkCollision(beater: Beater) {}

  protected buildMesh() {
    this.mesh = EditorUtils.createTriangleMesh(defaultTriangleSize, this.id);
  }

  protected playSound() {}
}
