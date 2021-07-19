import * as THREE from 'three';
import { Beater } from '../common/types/shapes/Beater';
import { Shape, ShapeType } from '../common/types/shapes/Shape';

export class EditorUtils {
  public static clickedShape(shapes: Shape[], mousePos: THREE.Vector3): Shape | undefined {
    for (const shape of shapes) {
      if (EditorUtils.meshContainsPoint(shape.mesh, mousePos)) {
        return shape;
      }
    }

    return undefined;
  }

  public static shapeIntersectsOthers(shape: Shape, others: Shape[]): boolean {
    for (const other of others) {
      if (EditorUtils.meshesIntersectAABB(shape.mesh, other.mesh)) {
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

  public static createShape(id: string, shapeType: ShapeType) {
    let shape: Shape;
    switch (shapeType) {
      case ShapeType.BEATER:
        shape = new Beater(id, shapeType);
    }

    return shape;
  }

  public static createBeaterShape(radius: number) {
    const beaterSegments = 20;

    const geom = new THREE.CircleGeometry(radius, beaterSegments, 0, Math.PI * 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    return new THREE.Mesh(geom, mat);
  }

  public static createSquareShape(size: number) {
    //
  }
}
