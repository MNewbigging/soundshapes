import * as THREE from 'three';
import { Shape } from '../common/types/Shapes';

export interface ScreenLimits {
  fov: number;
  xMax: number;
  yMax: number;
}

export const screenLimits: ScreenLimits = {
  fov: 60,
  xMax: 105.5,
  yMax: 54.5,
};

export class GameUtils {
  public static clickedShape(shapes: Shape[], mousePos: THREE.Vector3): Shape | undefined {
    for (const shape of shapes) {
      if (GameUtils.meshContainsPoint(shape.mesh, mousePos)) {
        return shape;
      }
    }

    return undefined;
  }

  public static shapeIntersectsOthers(shape: Shape, others: Shape[]): boolean {
    for (const other of others) {
      if (GameUtils.meshesIntersectAABB(shape.mesh, other.mesh)) {
        return true;
      }
    }

    return false;
  }

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
