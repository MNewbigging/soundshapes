// tslint:disable: max-classes-per-file

import * as THREE from 'three';

export enum ShapeType {
  TRIANGLE = 'triangle',
  BEATER = 'beater',
}

export abstract class Shape {
  public type: ShapeType;
  public mesh: THREE.Mesh;

  constructor(type: ShapeType, mesh: THREE.Mesh) {
    this.type = type;
    this.mesh = mesh;
  }
}

export class Beater extends Shape {}
