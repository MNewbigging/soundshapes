import * as THREE from 'three';
import { Beater } from '../common/types/shapes/Beater';
import { Shape, ShapeType } from '../common/types/shapes/Shape';
import { Square } from '../common/types/shapes/Square';
import { SceneLimits } from './GameScene';

export class EditorUtils {
  public static clickedShape(shapes: Shape[], mousePos: THREE.Vector3): Shape | undefined {
    for (const shape of shapes) {
      if (EditorUtils.meshContainsPoint(shape.mesh, mousePos)) {
        return shape;
      }
    }

    return undefined;
  }

  public static meshContainsPoint(mesh: THREE.Mesh, point: THREE.Vector3) {
    const box = new THREE.Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

    return box.containsPoint(point);
  }

  public static shapePositionValid(shape: Shape, sceneLimits: SceneLimits, otherShapes: Shape[]) {
    // Check against bounds
    if (EditorUtils.meshOutOfBounds(shape.mesh, sceneLimits)) {
      return false;
    }

    // Check against other shapes
    if (EditorUtils.shapeIntersectsOthers(shape, otherShapes)) {
      return false;
    }

    // Position is valid
    return true;
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

  public static meshOutOfBounds(mesh: THREE.Mesh, bounds: SceneLimits) {
    mesh.geometry.computeBoundingBox();
    const bb = new THREE.Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

    // Horizontal
    if (Math.abs(bb.min.x) > bounds.xMax || Math.abs(bb.max.x) > bounds.xMax) {
      // out of bounds on x
      return true;
    }
    // Vertical
    if (Math.abs(bb.min.y) > bounds.yMax || Math.abs(bb.max.y) > bounds.yMax) {
      // out of bounds on y
      return true;
    }

    return false;
  }

  public static createShape(id: string, shapeType: ShapeType) {
    let shape: Shape;
    switch (shapeType) {
      case ShapeType.BEATER:
        shape = new Beater(id, shapeType);
        break;
      case ShapeType.SQUARE:
        shape = new Square(id, shapeType);
        break;
    }

    return shape;
  }

  public static createBeaterMesh(radius: number, id: string) {
    const beaterSegments = 20;

    const geom = new THREE.CircleGeometry(radius, beaterSegments, 0, Math.PI * 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = id;

    return mesh;
  }

  public static createSquareMesh(size: number, id: string) {
    const geom = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({ color: 0x1bbb7f });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = id;

    return mesh;
  }
}
