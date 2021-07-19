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

  protected playSound() {
    // This gets called when this shape is struck by a beater
    // We can pass the beater as a parm later, to get its effects (when we implement effects)
    // Playing sounds:
    // You can check what kind of shape this is with the type propery, so you could
    // pass this into your own function to decide what kind of sound to play
    // Or, better, if you're making your own class hierarchy, you can add the correct
    // sound type as a new property to the shape classes (not this one). E.g, go to
    // Square.ts and add your sound property there.
  }
}
