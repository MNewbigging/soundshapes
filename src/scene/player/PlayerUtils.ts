import * as THREE from 'three';

import { Beater } from '../../common/types/shapes/Beater';
import { Circle } from '../../common/types/shapes/Circle';
import { Shape } from '../../common/types/shapes/Shape';
import { Square } from '../../common/types/shapes/Square';
import { Triangle } from '../../common/types/shapes/Triangle';
import { SceneLimits } from '../GameScene';

export class PlayerUtils {
  public static checkBoundsCollisions(beater: Beater, screenLimits: SceneLimits) {
    const bx = beater.mesh.position.x;
    const by = beater.mesh.position.y;
    const r = beater.radius;

    // Horizontal bounds
    if (bx - r < -screenLimits.xMax) {
      // Flip x direction
      beater.velocity.x *= -1;

      // Find distance crossed over and displace beater
      const dist = bx - r - -screenLimits.xMax;
      beater.mesh.position.x += Math.abs(dist);
      //
    } else if (bx + r > screenLimits.xMax) {
      // Flip x direction
      beater.velocity.x *= -1;

      // Find distance crossed over and displace beater
      const dist = bx + r - screenLimits.xMax;
      beater.mesh.position.x -= Math.abs(dist);
    }

    // Vertical bounds
    if (by - r < -screenLimits.yMax) {
      // Flip y direction
      beater.velocity.y *= -1;

      // Find distance crossed over and displace beater
      const dist = by - r - -screenLimits.yMax;
      beater.mesh.position.y += Math.abs(dist);

      // Find
    } else if (by + r > screenLimits.yMax) {
      // Flip y direction
      beater.velocity.y *= -1;

      // Find distance crossed over and displace beater
      const dist = by + r - screenLimits.yMax;
      beater.mesh.position.y -= Math.abs(dist);
    }
  }

  public static checkBeaterToBeaterCollision(beater: Beater, others: Beater[]) {
    // Only check against the closest other
    // Do this manually here to reuse distanceSq value
    let closestDist = Infinity;
    let closestIdx = -1;
    others.forEach((other, i) => {
      if (other.id !== beater.id) {
        const dx = other.mesh.position.x - beater.mesh.position.x;
        const dy = other.mesh.position.y - beater.mesh.position.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < closestDist) {
          closestDist = distanceSq;
          closestIdx = i;
        }
      }
    });

    const target = others[closestIdx];

    // First check if circles are moving towards each other

    // Do the circles overlap each other?
    const beaterPos = new THREE.Vector2(beater.mesh.position.x, beater.mesh.position.y);
    const targetPos = new THREE.Vector2(target.mesh.position.x, target.mesh.position.y);

    // Get the distance from target to beater
    const bt = new THREE.Vector2().copy(targetPos).sub(beaterPos);
    const distanceSq = closestDist;

    // Check if the distance is less than the sum of both beater's radii
    const radii = beater.radius + target.radius; // TODO - import this from somewhere
    const intersects = Math.abs(distanceSq) < radii * radii;

    if (!intersects) {
      return;
    }

    target.testedColsThisFrame = true;

    // Step 1 - displace beaters so they no longer overlap
    const distance = Math.sqrt(distanceSq);

    // Find out how much they overlap, halve to apply to both beaters evenly
    const overlap = 0.5 * (distance - radii);

    // Displace beaters to move out of collision range
    // overlap * collision normal

    beater.mesh.position.x -= (overlap * (beaterPos.x - targetPos.x)) / distance;
    beater.mesh.position.y -= (overlap * (beaterPos.y - targetPos.y)) / distance;

    target.mesh.position.x += (overlap * (beaterPos.x - targetPos.x)) / distance;
    target.mesh.position.y += (overlap * (beaterPos.y - targetPos.y)) / distance;

    // Step 2 - adjust directions of both beaters according to collision

    // Reflect beater direction by col normal
    // const colNormal = bt.normalize();
    // const dot = 2 * beater.direction.dot(colNormal);
    // const scaledVec = colNormal.multiplyScalar(dot);

    // beater.direction.x -= scaledVec.x;
    // beater.direction.y -= scaledVec.y;

    // // Do the same for target
    // const tb = new THREE.Vector2().copy(beaterPos).sub(targetPos);
    // const tn = tb.normalize();
    // const ts = 2 * target.direction.dot(tn);
    // const tsv = tn.multiplyScalar(ts);

    // target.direction.x -= tsv.x;
    // target.direction.y -= tsv.y;

    // NOTE - this passes momentum so can affect speed
    // Angles
    const angle = Math.atan2(bt.x, bt.y);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Beater perpendicular velocity
    const vx1 = beater.velocity.x * cos + beater.velocity.y * sin;
    const vy1 = beater.velocity.y * cos - beater.velocity.x * sin;

    // Target beater perp vel
    const vx2 = target.velocity.x * cos + target.velocity.y * sin;
    const vy2 = target.velocity.y * cos - target.velocity.x * sin;

    // Swap the x vel (y is parallel so doesn't matter)
    // and rotate back the adjustd per velocities
    beater.velocity.x = vx2 * cos - vy1 * sin;
    beater.velocity.y = vy1 * cos + vx2 * sin;

    target.velocity.x = vx1 * cos - vy2 * sin;
    target.velocity.y = vy2 * cos + vx1 * sin;
  }

  public static getClosestShape(shape: Shape, others: Shape[]): Shape {
    let closestDist = Infinity;
    let closestIdx = -1;
    others.forEach((other, i) => {
      // Ignore self
      if (other.id !== shape.id) {
        const distSq = shape.mesh.position.distanceToSquared(other.mesh.position);
        if (distSq < closestDist) {
          closestDist = distSq;
          closestIdx = i;
        }
      }
    });

    return others[closestIdx];
  }

  public static checkShapeCollisions(beater: Beater, shapes: Shape[]) {
    // Only check against closest shape
    const closest = PlayerUtils.getClosestShape(beater, shapes);
    closest.checkCollision(beater);
  }

  public static circleToSquareCollision(beater: Beater, square: Square): boolean {
    const circlePos = new THREE.Vector2(beater.mesh.position.x, beater.mesh.position.y);
    const rectPos = new THREE.Vector2(square.mesh.position.x, square.mesh.position.y);

    const collides = this.isCircleInRectArea(
      rectPos,
      square.size,
      square.size,
      circlePos,
      beater.radius
    );

    if (collides) {
      // Find nearest points on rect
      const halfSize = square.size * 0.5;

      const rectLeft = rectPos.x - halfSize;
      const rectRight = rectPos.x + halfSize;
      const xNearest = Math.max(rectLeft, Math.min(circlePos.x, rectRight));

      const rectTop = rectPos.y + halfSize;
      const rectBot = rectPos.y - halfSize;
      const yNearest = Math.max(rectBot, Math.min(circlePos.y, rectTop));

      // Reflect around nearest point normal
      const dist = new THREE.Vector2(circlePos.x - xNearest, circlePos.y - yNearest);
      const distNormal = dist.normalize();
      const dot = 2 * beater.velocity.dot(distNormal);
      const scaled = distNormal.multiplyScalar(dot);

      beater.velocity.x -= scaled.x;
      beater.velocity.y -= scaled.y;

      // Move out of collision area
      // TODO - works too well - moves too far!
      // const penDepth = beater.radius - dist.length();
      // const penVec = dn.multiplyScalar(penDepth);

      // beater.mesh.position.x += penVec.x;
      // beater.mesh.position.y += penVec.y;
    }

    return collides;
  }

  public static isCircleInRectArea(
    rPos: THREE.Vector2,
    rW: number,
    rH: number,
    cPos: THREE.Vector2,
    cR: number
  ) {
    // Distances between circle and rectangle
    const dx = Math.abs(cPos.x - rPos.x);
    const dy = Math.abs(cPos.y - rPos.y);

    const halfWidth = rW * 0.5;
    const halfHeight = rH * 0.5;

    // Easy cases where circle is not colliding
    if (dx > halfWidth + cR) return false;
    if (dy > halfHeight + cR) return false;

    // Easy cases of collision
    if (dx < halfWidth) return true;
    if (dy < halfHeight) return true;

    // Corner cases
    const cornerDistSq =
      (dx - halfWidth) * (dx - halfWidth) + (dy - halfHeight) * (dy - halfHeight);

    return cornerDistSq <= cR * cR;
  }

  public static circleToTriangleCollision(beater: Beater, triangle: Triangle) {
    // Create a new triangle shape to represent our mesh obj
    //const v = new THREE.Vector3();
    //triangle.mesh.localToWorld(v);

    // Make a copy of the triangle (has methods for closest point)
    const tri = new THREE.Triangle(triangle.vertexA, triangle.vertexB, triangle.vertexC);

    // Get the closest point to circle on the triangle
    const closestPoint = new THREE.Vector3();
    tri.closestPointToPoint(beater.mesh.position, closestPoint);

    // Get distance from closest point to circle center (sq)
    const distVec = new THREE.Vector3().copy(beater.mesh.position).sub(closestPoint);
    const distSq = distVec.lengthSq();

    // Is distance sq smaller than beater radius squared?
    if (distSq < beater.radius * beater.radius) {
      // Collides; reflect around closest point normal
      const distNormal = distVec.normalize();
      const dnv2 = new THREE.Vector2(distNormal.x, distNormal.y);

      const dot = 2 * beater.velocity.dot(dnv2);
      const scaled = new THREE.Vector2().copy(dnv2).multiplyScalar(dot);

      beater.velocity.x -= scaled.x;
      beater.velocity.y -= scaled.y;
    }
  }

  public static circleToCircleCollision(beater: Beater, circle: Circle) {
    // Is this distance between beater and circle smaller than the sum of their radii
    const dx = circle.mesh.position.x - beater.mesh.position.x;
    const dy = circle.mesh.position.y - beater.mesh.position.y;
    const distanceSq = dx * dx + dy * dy;

    const radii = beater.radius + circle.radius;

    const intersects = Math.abs(distanceSq) < radii * radii;

    if (intersects) {
      // Displace the beater so it no longer intersects with the circle
      const distance = Math.sqrt(distanceSq);
      const colNormal = new THREE.Vector2(dx / distance, dy / distance);
      const overlap = Math.abs(distance - radii);

      beater.mesh.position.x -= overlap * colNormal.x;
      beater.mesh.position.y -= overlap * colNormal.y;

      // Reflect around collision normal
      const dot = 2 * beater.velocity.dot(colNormal);
      const scaledVec = colNormal.multiplyScalar(dot);

      beater.velocity.x -= scaledVec.x;
      beater.velocity.y -= scaledVec.y;
    }

    return intersects;
  }
}
