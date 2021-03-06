import { action, observable } from 'mobx';
import * as THREE from 'three';
import { Beater } from './Beater';

export enum ShapeType {
  BEATER = 'beater',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  SQUARE = 'square',
}

export abstract class Shape {
  public id: string;
  public type: ShapeType;
  public mesh: THREE.Mesh;
  public outline: THREE.LineSegments;
  protected test: string;

  @observable public scale = 1;
  @observable public posX = 0;
  @observable public posY = 0;

  constructor(id: string, type: ShapeType) {
    this.id = id;
    this.type = type;

    // Build own mesh, set positions after we have the mesh
    this.buildMesh();
    this.posX = this.mesh.position.x;
    this.posY = this.mesh.position.y;

    // Can now build the outline
    this.createOutline();
  }

  public createOutline() {
    const edges = new THREE.EdgesGeometry(this.mesh.geometry);
    const outlineMat = new THREE.LineBasicMaterial({ color: 'red' });
    const outline = new THREE.LineSegments(edges, outlineMat);
    outline.position.set(this.mesh.position.x, this.mesh.position.y, 0);
    this.outline = outline;

    console.log('outline', this.outline.geometry.getAttribute('position'));
  }

  @action public setPosition(pos: THREE.Vector3) {
    // Update shape mesh
    this.mesh.position.set(pos.x, pos.y, 0);
    this.mesh.updateMatrixWorld();

    // And outline
    this.outline.position.set(this.mesh.position.x, this.mesh.position.y, 0);

    // For updating UI
    this.posX = pos.x;
    this.posY = pos.y;
  }

  @action public setScale(scale: number) {
    this.scale = scale;

    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;

    this.outline.scale.x = scale;
    this.outline.scale.y = scale;

    this.mesh.updateMatrixWorld();
  }

  public addToScene(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  public removeFromScene(scene: THREE.Scene) {
    scene.remove(this.mesh);
    this.hideOutline(scene);
  }

  public showOutline(scene: THREE.Scene) {
    scene.add(this.outline);
  }

  public hideOutline(scene: THREE.Scene) {
    scene.remove(this.outline);
  }

  public abstract checkCollision(beater: Beater): void;

  protected abstract buildMesh(): void;

  protected abstract playSound(beater: Beater): void;
}
