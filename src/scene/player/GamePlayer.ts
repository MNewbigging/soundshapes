import Matter, { Bodies, Body, Composite, Engine, ICompositeDefinition, World } from 'matter-js';

import { Beater, Shape, ShapeType } from '../../common/types/Shapes';
import { SceneLimits } from '../GameScene';

import { PlayerUtils } from './PlayerUtils';

/**
 * The GamePlayer takes over when playing the game. It deals with the physics, and sends
 * collision events for the sound system to pick up.
 */
export class GamePlayer {
  private screenLimits: SceneLimits;
  private shapes: Shape[];
  private beaters: Beater[];

  constructor(shapes: Shape[], screenLimits: SceneLimits) {
    // Get shape data
    this.screenLimits = screenLimits;
    this.shapes = shapes.filter((shape) => shape.type !== ShapeType.BEATER);

    this.beaters = shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (this.beaters.length) {
      this.beaters.forEach((beater) => beater.setStartingDirection());
    }
  }

  public stopPlayer() {
    // Reset beater positions
    this.beaters.forEach((beater) => beater.resetPosition());
  }

  public update = () => {
    // Move all the beaters, then check for collisions
    this.beaters.forEach((beater) => {
      this.moveBeater(beater);
      this.checkCollisions(beater);
    });
  };

  private moveBeater(beater: Beater) {
    beater.mesh.position.x += beater.direction.x * beater.speed;
    beater.mesh.position.y += beater.direction.y * beater.speed;
  }

  private checkCollisions(beater: Beater) {
    // Check against screen limits
    PlayerUtils.checkBoundsCollisions(beater, this.screenLimits);
    // Check against other beaters
    if (this.beaters.length > 1) {
      PlayerUtils.checkBeaterToBeaterCollision(beater, this.beaters);
    }
  }
}
