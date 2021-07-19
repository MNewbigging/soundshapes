import { action, observable } from 'mobx';
import * as THREE from 'three';

export enum ShapeType {
  BEATER = 'beater',
  SQUARE = 'square',
}

export abstract class Shape {
  public id: string;
  public type: ShapeType;
  public mesh: THREE.Mesh;

  @observable public posX = 0;
  @observable public posY = 0;

  constructor(id: string, type: ShapeType) {
    this.id = id;
    this.type = type;

    // Build own mesh
    this.buildMesh();
  }

  @action public setPosition(pos: THREE.Vector3) {
    this.mesh.position.set(pos.x, pos.y, 0);
    // TODO - this doesn't apply world matrix, so might not be necessary each pos change
    this.mesh.geometry.computeBoundingBox();
    this.mesh.updateMatrixWorld();

    // For updating UI
    this.posX = pos.x;
    this.posY = pos.y;
  }

  public addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  protected abstract buildMesh(): void;
}
