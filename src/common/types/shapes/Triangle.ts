import * as THREE from 'three';

import { EditorUtils } from '../../../scene/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { Beater } from './Beater';
import { Shape } from './Shape';

const defaultTriangleSize = 10;

export class Triangle extends Shape {
  public size = defaultTriangleSize;
  public vertexA = new THREE.Vector3();
  public vertexB = new THREE.Vector3();
  public vertexC = new THREE.Vector3();

  public setPosition(pos: THREE.Vector3) {
    super.setPosition(pos);
    this.setVertices();
  }

  public checkCollision(beater: Beater) {
    PlayerUtils.circleToTriangleCollision(beater, this);
  }

  protected buildMesh() {
    this.mesh = EditorUtils.createTriangleMesh(defaultTriangleSize, this.id);

    this.setVertices();
  }

  protected playSound() {}

  private setVertices() {
    const positions = this.mesh.geometry.getAttribute('position').array as number[];
    const vertices: THREE.Vector3[] = [];
    for (let i = 0; i < 9; i += 3) {
      vertices.push(
        new THREE.Vector3(
          positions[i] + this.mesh.position.x,
          positions[i + 1] + this.mesh.position.y,
          positions[i + 2]
        )
      );
    }
    this.vertexA = vertices[0];
    this.vertexB = vertices[1];
    this.vertexC = vertices[2];

    console.log('vertices: ', vertices);
  }
}
