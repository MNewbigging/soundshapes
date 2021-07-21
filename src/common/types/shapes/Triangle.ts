import * as THREE from 'three';
import { ShapesToolbar } from '../../../gui/shapes-toolbar/ShapesToolbar';

import { EditorUtils } from '../../../scene/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { STTriangle } from '../../../sound/STTriangle';
import { Beater, BeaterEffects } from './Beater';
import { Shape, ShapeType } from './Shape';

const defaultTriangleSize = 10;

export class Triangle extends Shape {
  public size = defaultTriangleSize;
  public vertexA = new THREE.Vector3();
  public vertexB = new THREE.Vector3();
  public vertexC = new THREE.Vector3();

  private sound:STTriangle = new STTriangle();

  public setPosition(pos: THREE.Vector3) {
    super.setPosition(pos);
    this.setVertices();
  }

  public setScale(scale: number) {
    super.setScale(scale);
    this.size *= scale;
    this.setVertices();
  }

  public checkCollision(beater: Beater) {
    PlayerUtils.circleToTriangleCollision(beater, this);
  }

  protected buildMesh() {
    this.mesh = EditorUtils.createTriangleMesh(defaultTriangleSize, this.id);

    this.setVertices();
  }

  protected playSound(beater:Beater) {
    const shapeScale:number = this.scale;
    const impactStrength:number = beater.speed;
    const effects:BeaterEffects[] = beater.effects;
    this.sound.TriggerImpact(shapeScale, impactStrength, effects); 
  }

  private setVertices() {
    const positions = this.mesh.geometry.getAttribute('position').array as number[];
    const vertices: THREE.Vector3[] = [];
    for (let i = 0; i < 9; i += 3) {
      vertices.push(
        new THREE.Vector3(
          positions[i] * this.scale + this.mesh.position.x,
          positions[i + 1] * this.scale + this.mesh.position.y,
          0 // z always 0
        )
      );
    }
    this.vertexA = vertices[0];
    this.vertexB = vertices[1];
    this.vertexC = vertices[2];
  }
}
