import * as THREE from 'three';

export class GameUtils {
  public static createBeaterShape() {
    const beaterRadius = 3;
    const beaterSegments = 20;

    const geom = new THREE.CircleGeometry(beaterRadius, beaterSegments, 0, Math.PI * 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    return new THREE.Mesh(geom, mat);
  }
}
