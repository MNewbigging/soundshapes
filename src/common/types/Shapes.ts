// tslint:disable: max-classes-per-file

import { action, observable } from 'mobx';
import * as THREE from 'three';

export enum ShapeType {
  TRIANGLE = 'triangle',
  BEATER = 'beater',
}

export class Shape {
  public id: string;
  public type: ShapeType;
  public mesh: THREE.Mesh;

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
}

export class Beater extends Shape {
  // Observables are for updating GUI
  @observable public speed = 1;
  @observable public rotation = 0;

  // Editor values
  private directionLine: THREE.Line;
  // Points up by default
  private readonly defaultDirection = new THREE.Vector2(0, 10);
  private directionLineEndPoint = new THREE.Vector2();

  // Player values
  public direction = new THREE.Vector2().copy(this.defaultDirection);

  constructor(id: string, type: ShapeType, mesh: THREE.Mesh) {
    super(id, type, mesh);

    // Create a line to show direction for this beater
    const mat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geom = new THREE.BufferGeometry();

    // Allow space for two points on this line
    const itemSize = 3; // three 'items' in a position vector3
    const positionCount = 2; // each line has two position vectors
    const points = new Float32Array(positionCount * itemSize);
    geom.setAttribute('position', new THREE.BufferAttribute(points, itemSize));

    this.directionLine = new THREE.Line(geom, mat);

    this.mesh.attach(this.directionLine);
  }

  public updateDirectionLine() {
    const positions = this.directionLine.geometry.getAttribute('position').array as number[];

    // First three numbers in array are from beater's center position
    positions[0] = this.mesh.position.x;
    positions[1] = this.mesh.position.y;
    // z is always zero

    // Find the end point of the vector pointing straight up
    const endPoint = new THREE.Vector2(this.mesh.position.x, this.mesh.position.y).add(
      this.defaultDirection
    );
    const rads = -this.rotation * (Math.PI / 180);
    endPoint.rotateAround(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), rads);

    positions[3] = endPoint.x;
    positions[4] = endPoint.y;

    this.directionLine.geometry.getAttribute('position').needsUpdate = true;

    // Save the endpoint position for creating directional vector in player
    this.directionLineEndPoint = endPoint;
  }

  public showDirectionLine(scene: THREE.Scene) {
    scene.add(this.directionLine);
  }

  public hideDirectionLine(scene: THREE.Scene) {
    scene.remove(this.directionLine);
  }

  public setPosition(pos: THREE.Vector3) {
    super.setPosition(pos);
    this.updateDirectionLine();
  }

  @action public setSpeed(speed: number) {
    this.speed = speed;
  }

  @action public setRotation(rot: number) {
    this.rotation = rot;
    this.updateDirectionLine();
  }

  // Player functions

  public setStartingDirection() {
    // Get endpoint - position and normalise for facing direction
    const face = new THREE.Vector2()
      .copy(this.directionLineEndPoint)
      .sub(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y));
    this.direction = face.normalize();
  }

  public resetPosition() {
    this.mesh.position.x = this.posX;
    this.mesh.position.y = this.posY;
  }
}
