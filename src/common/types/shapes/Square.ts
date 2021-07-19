import { EditorUtils } from '../../../scene/EditorUtils';
import { Shape } from './Shape';

const defaultSquareSize = 10;

export class Square extends Shape {
  public size = defaultSquareSize;

  protected buildMesh() {
    this.mesh = EditorUtils.createSquareMesh(defaultSquareSize);
  }
}
