// tslint:disable: max-classes-per-file

import { action, observable } from 'mobx';
import * as THREE from 'three';

export enum ShapeType {
  TRIANGLE = 'triangle',
  BEATER = 'beater',
}

export abstract class Shape {
  public id: string;
  public type: ShapeType;
  @observable public mesh: THREE.Mesh;

  @observable public posX = 0;
  @observable public posY = 0;

  constructor(id: string, type: ShapeType, mesh: THREE.Mesh) {
    this.id = id;
    this.type = type;
    this.mesh = mesh;

    this.posX = mesh.position.x;
    this.posY = mesh.position.y;
  }

  @action public setPosition(pos: THREE.Vector3) {
    this.mesh.position.set(pos.x, pos.y, 0);
    this.mesh.geometry.computeBoundingBox();
    this.mesh.updateMatrixWorld();

    // For updating UI
    this.posX = pos.x;
    this.posY = pos.y;
  }

  public abstract addToScene(scene: THREE.Scene): void;
}

export class Beater extends Shape {
  @observable public speed = 1;
  @observable public direction = new THREE.Vector3(0, 1, 0);

  public addToScene(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  @action public setSpeed(speed: number) {
    this.speed = speed;
  }
}
