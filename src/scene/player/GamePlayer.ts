import { Beater, Shape, ShapeType } from '../../common/types/Shapes';
import { ScreenLimits } from '../GameUtils';

/**
 * The GamePlayer takes over when playing the game. It deals with the physics, and sends
 * collision events for the sound system to pick up.
 */
export class GamePlayer {
  private screenLimits: ScreenLimits;
  private shapes: Shape[];
  private beaters: Beater[];

  constructor(shapes: Shape[], screenLimits: ScreenLimits) {
    this.screenLimits = screenLimits;
    this.shapes = shapes.filter((shape) => shape.type !== ShapeType.BEATER);

    this.beaters = shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
  }

  public stopPlayer() {
    //
  }

  public update = () => {
    // Update all the beaters
  };
}
