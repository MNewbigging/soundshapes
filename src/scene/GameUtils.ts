import * as THREE from 'three';

export class GameUtils {
  // Assumes pre-computed bounding boxes
  public static meshesIntersectAABB(meshA: THREE.Mesh, meshB: THREE.Mesh) {
    const boxA = new THREE.Box3().copy(meshA.geometry.boundingBox).applyMatrix4(meshA.matrixWorld);
    const boxB = new THREE.Box3().copy(meshB.geometry.boundingBox).applyMatrix4(meshB.matrixWorld);

    return boxA.intersectsBox(boxB);
  }

  public static meshContainsPoint(mesh: THREE.Mesh, point: THREE.Vector3) {
    const box = new THREE.Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

    return box.containsPoint(point);
  }

  public static createBeaterShape() {
    const beaterRadius = 3;
    const beaterSegments = 20;

    const geom = new THREE.CircleGeometry(beaterRadius, beaterSegments, 0, Math.PI * 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    return new THREE.Mesh(geom, mat);
  }
}
