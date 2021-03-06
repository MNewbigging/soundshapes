import { Beater } from '../../common/types/shapes/Beater';
import { Shape, ShapeType } from '../../common/types/shapes/Shape';
import { SceneLimits } from '../GameScene';

import { PlayerUtils } from './PlayerUtils';

/**
 * The GamePlayer takes over when playing the game. It deals with the physics, and sends
 * collision events for the sound system to pick up.
 */
export const movementMultiplier = 0.2;

export class GamePlayer {
  private screenLimits: SceneLimits;
  private shapes: Shape[];
  private beaters: Beater[];

  constructor(shapes: Shape[], screenLimits: SceneLimits) {
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
    // Move all the beaters
    this.beaters.forEach((beater) => {
      this.moveBeater(beater);
    });

    // Check for collisions
    this.beaters.forEach((beater) => {
      if (!beater.testedColsThisFrame) {
        this.checkCollisions(beater);
      }
    });

    // Reset beaters for next frame
    this.beaters.forEach((beater) => (beater.testedColsThisFrame = false));
  };

  private moveBeater(beater: Beater) {
    beater.mesh.position.x += beater.velocity.x;
    beater.mesh.position.y += beater.velocity.y;
  }

  private checkCollisions(beater: Beater) {
    // Check against screen limits
    PlayerUtils.checkBoundsCollisions(beater, this.screenLimits);
    // TODO - remove these length checks; game shouldn't run without either
    // Check against other beaters
    if (this.beaters.length > 1) {
      PlayerUtils.checkBeaterToBeaterCollision(beater, this.beaters);
    }
    // Check against shapes
    if (this.shapes.length) {
      PlayerUtils.checkShapeCollisions(beater, this.shapes);
    }
  }
}
