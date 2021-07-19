import * as THREE from 'three';

import { Beater } from '../../common/types/shapes/Beater';
import { Shape } from '../../common/types/shapes/Shape';
import { Square } from '../../common/types/shapes/Square';
import { SceneLimits } from '../GameScene';
import { movementMultiplier } from './GamePlayer';

export class PlayerUtils {
  public static checkBoundsCollisions(beater: Beater, screenLimits: SceneLimits) {
    const bx = beater.mesh.position.x;
    const by = beater.mesh.position.y;
    const r = beater.radius;

    // Horizontal bounds
    if (bx - r < -screenLimits.xMax) {
      // Flip x direction
      beater.direction.x *= -1;

      // Find distance crossed over and displace beater
      const dist = bx - r - -screenLimits.xMax;
      beater.mesh.position.x += Math.abs(dist);
      //
    } else if (bx + r > screenLimits.xMax) {
      // Flip x direction
      beater.direction.x *= -1;

      // Find distance crossed over and displace beater
      const dist = bx + r - screenLimits.xMax;
      beater.mesh.position.x -= Math.abs(dist);
    }

    // Vertical bounds
    if (by - r < -screenLimits.yMax) {
      // Flip y direction
      beater.direction.y *= -1;

      // Find distance crossed over and displace beater
      const dist = by - r - -screenLimits.yMax;
      beater.mesh.position.y += Math.abs(dist);

      // Find
    } else if (by + r > screenLimits.yMax) {
      // Flip y direction
      beater.direction.y *= -1;

      // Find distance crossed over and displace beater
      const dist = by + r - screenLimits.yMax;
      beater.mesh.position.y -= Math.abs(dist);
    }
  }

  public static checkBeaterToBeaterCollision(beater: Beater, others: Beater[]) {
    // Only check against the closest other
    //const target = PlayerUtils.getClosestShape(beater, others) as Beater;
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

    // Do the circles overlap each other?
    const beaterPos = new THREE.Vector2(beater.mesh.position.x, beater.mesh.position.y);
    const targetPos = new THREE.Vector2(target.mesh.position.x, target.mesh.position.y);

    // Get the distance from target to beater
    // const distanceSq =
    //   (targetPos.x - beaterPos.x) * (targetPos.x - beaterPos.x) +
    //   (targetPos.y - beaterPos.y) * (targetPos.y - beaterPos.y);
    const bt = new THREE.Vector2().copy(targetPos).sub(beaterPos);
    //const distanceSq = bt.lengthSq();
    const distanceSq = closestDist;

    // Check if the distance is less than the sum of both beater's radii
    const radii = 6; // TODO - import this from somewhere
    const intersects = Math.abs(distanceSq) < radii * radii;

    if (!intersects) {
      return;
    }

    console.log('collision');

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
    const colNormal = bt.normalize();
    const scalar = 2 * beater.direction.dot(colNormal);
    const scaledVec = new THREE.Vector2().copy(colNormal).multiplyScalar(scalar);

    beater.direction.x -= scaledVec.x;
    beater.direction.y -= scaledVec.y;

    // Do the same for target
    const tb = new THREE.Vector2().copy(beaterPos).sub(targetPos);
    const tn = tb.normalize();
    const ts = 2 * target.direction.dot(tn);
    const tsv = new THREE.Vector2().copy(tn).multiplyScalar(ts);

    target.direction.x -= tsv.x;
    target.direction.y -= tsv.y;

    // NOTE - this passes momentum so can affect speed
    // Angles
    // const angle = Math.atan2(bt.x, bt.y);
    // const sin = Math.sin(angle);
    // const cos = Math.cos(angle);

    // // Beater perpendicular velocity
    // const vx1 = beater.direction.x * cos + beater.direction.y * sin;
    // const vy1 = beater.direction.y * cos - beater.direction.x * sin;

    // // Target beater perp vel
    // const vx2 = target.direction.x * cos + target.direction.y * sin;
    // const vy2 = target.direction.y * cos - target.direction.x * sin;

    // // Swap the x vel (y is parallel so doesn't matter)
    // // and rotate back the adjustd per velocities
    // beater.direction.x = vx2 * cos - vy1 * sin;
    // beater.direction.y = vy1 * cos + vx2 * sin;

    // target.direction.x = vx1 * cos - vy2 * sin;
    // target.direction.y = vy2 * cos + vx1 * sin;
  }

  public static getClosestShape(shape: Shape, others: Shape[]): Shape {
    let closestDist = Infinity;
    let closestIdx = -1;
    others.forEach((other, i) => {
      // Ignore self
      if (other.id !== shape.id) {
        const distSq = other.mesh.position.distanceToSquared(other.mesh.position);
        if (distSq < closestDist) {
          closestDist = distSq;
          closestIdx = i;
        }
      }
    });

    return others[closestIdx];
  }

  public static checkShapeCollisions(beater: Beater, shapes: Shape[]) {
    // Determine which calculation to run based on shape type
    // TODO - is this switch inefficient?
    shapes.forEach((shape) => shape.checkCollision(beater));
  }

  public static circleToSquareCollision(beater: Beater, square: Square) {
    const circlePos = new THREE.Vector2(beater.mesh.position.x, beater.mesh.position.y);
    const rectPos = new THREE.Vector2(square.mesh.position.x, square.mesh.position.y);

    if (this.isCircleInRectArea(rectPos, square.size, square.size, circlePos, beater.radius)) {
      // Find the

      console.log('colliding');

      // const halfSize = square.size * 0.5;

      // const rectLeft = rectPos.x - halfSize;
      // const rectRight = rectPos.x + halfSize;
      // const xNearest = Math.max(rectLeft, Math.min(circlePos.x, rectRight));

      // const rectTop = rectPos.y - halfSize;
      // const rectBot = rectPos.y + halfSize;
      // const yNearest = Math.max(rectTop, Math.min(circlePos.y, rectBot));

      // const dist = new THREE.Vector2(circlePos.x - xNearest, circlePos.y - yNearest);
      // const dn = dist.normalize();
      // const scalar = 2 * beater.direction.dot(dn);
      // const scaled = new THREE.Vector2().copy(dn).multiplyScalar(scalar);

      // beater.direction.x -= scaled.x;
      // beater.direction.y -= scaled.y;

      // // Move out of collision area
      // const penDepth = beater.radius - dist.length();
      // const penVec = dn.multiplyScalar(penDepth);
      // const newPos = new THREE.Vector2().copy(circlePos).sub(penVec);

      // beater.mesh.position.x = newPos.x;
      // beater.mesh.position.y = newPos.y;
    }
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

  public static getClosestPointOnRect(
    rPos: THREE.Vector2,
    rW: number,
    rH: number,
    cPos: THREE.Vector2
  ) {
    let xClosest;
    const rLeftPos = rPos.x - rW * 0.5;
    const rRightPos = rPos.x + rW * 0.5;

    // Check if already within bounds
    if (cPos.x > rLeftPos && cPos.x < rRightPos) {
      xClosest = cPos.x;
    } else {
      // Not already within bounds, find closest x
      let dl = Math.abs(rLeftPos - cPos.x);
      let dr = Math.abs(rRightPos - cPos.x);
      xClosest = Math.min(dl, dr) === dl ? rLeftPos : rRightPos;
    }

    let yClosest;
    const rTopPos = rPos.y - rH * 0.5;
    const rBotPos = rPos.y + rH * 0.5;
  }
}
