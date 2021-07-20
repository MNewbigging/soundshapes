import { action, observable } from 'mobx';
import * as THREE from 'three';
import { Beater } from './Beater';

export enum ShapeType {
  BEATER = 'beater',
  SQUARE = 'square',
}

export abstract class Shape {
  public id: string;
  public type: ShapeType;
  public mesh: THREE.Mesh;
  public scale = 1;

  @observable public posX = 0;
  @observable public posY = 0;

  constructor(id: string, type: ShapeType) {
    this.id = id;
    this.type = type;

    // Build own mesh
    this.buildMesh();
    this.posX = this.mesh.position.x;
    this.posY = this.mesh.position.y;
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

  public abstract checkCollision(beater: Beater): void;

  protected abstract buildMesh(): void;

  protected abstract playSound(beater: Beater): void;
}
