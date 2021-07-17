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
  public mesh: THREE.Mesh;

  constructor(id: string, type: ShapeType, mesh: THREE.Mesh) {
    this.id = id;
    this.type = type;
    this.mesh = mesh;
  }
}

export class Beater extends Shape {
  @observable public speed = 1;

  @action public setSpeed(speed: number) {
    this.speed = speed;
  }
}
