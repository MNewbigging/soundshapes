import * as THREE from 'three';

import { Beater, Shape } from '../../common/types/Shapes';
import { ScreenLimits } from '../EditorUtils';

export class PlayerUtils {
  public static checkBoundsCollisions(beater: Beater, screenLimits: ScreenLimits) {
    const xAbs = Math.abs(beater.mesh.position.x);
    const yAbs = Math.abs(beater.mesh.position.y);

    // Horizontal bounds
    if (xAbs > screenLimits.xMax) {
      // Flip x direction
      beater.direction.x *= -1;
    }

    // Vertical bounds
    if (yAbs > screenLimits.yMax) {
      // Flip y direction
      beater.direction.y *= -1;
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
    const intersects = Math.abs(distanceSq) <= radii * radii;

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
}

/* Matterjs test code:
// Setup physics engine
    this.engine = Engine.create();

    // Disable gravity
    this.engine.gravity.y = 0;

    // Set bounds (is this even doing anything?!)
    this.engine.world.bounds = {
      min: { x: -screenLimits.xMax, y: -screenLimits.yMax },
      max: { x: screenLimits.xMax, y: screenLimits.yMax },
    };

    // Create walls for bounds
    const wallDepth = 20;
    const leftWall = Bodies.rectangle(-screenLimits.xMax, 0, wallDepth, screenLimits.yMax, {
      isStatic: true,
      frictionStatic: 0,
    });

    Composite.add(this.engine.world, leftWall);

    // Add the beaters under a composite
    const beaterBodies: Body[] = [];
    this.beaters.forEach((beater) => {
      // Create the body object
      const body = Bodies.circle(beater.posX, beater.posY, 3, {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        inertia: 0,
        restitution: 1.05,
        label: 'beater',
      });

      // Set starting values
      Body.setVelocity(body, {
        x: beater.direction.x * beater.speed,
        y: beater.direction.y * beater.speed,
      });

      beaterBodies.push(body);
    });
    // Add the beater comp to the world
    this.beaterComp = Composite.create();
    Composite.add(this.beaterComp, beaterBodies);
    Composite.add(this.engine.world, this.beaterComp);
    //this.beaterComp = Composite.add(this.engine.world, beaterComp);

    console.log('beaterComp: ', this.beaterComp);

    console.log('comps: ', this.engine.world.composites);

    console.log('world', this.engine.world);

    Update():

     // Update physics engine
    Engine.update(this.engine, 1000 / 60);

    // Update positions of objects
    this.beaterComp.bodies.forEach((body: Body, idx) => {
      this.beaters[idx].mesh.position.x = body.position.x;
      this.beaters[idx].mesh.position.y = body.position.y;
    });

*/
