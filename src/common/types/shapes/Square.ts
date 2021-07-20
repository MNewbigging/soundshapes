import { EditorUtils } from '../../../scene/EditorUtils';
import { PlayerUtils } from '../../../scene/player/PlayerUtils';
import { Beater, BeaterEffects } from './Beater';
import { Shape, ShapeType } from './Shape';

const defaultSquareSize = 10;

export class Square extends Shape {
  public size = defaultSquareSize;

  protected buildMesh() {
    this.mesh = EditorUtils.createSquareMesh(defaultSquareSize, this.id);
  }

  protected playSound(beater: Beater) {
    // Sound parameters:
    // Type - by class, this is a square, but can also get via:
    const shapeType: ShapeType = this.type;

    // Scale - there's no scaling in place now, but it will still use this prop:
    const shapeScale: number = this.scale;

    // Size of impact is just beater speed for now (how else would we measure it? By angle of attack maybe?)
    const impactStrength = beater.speed;

    // Beater effects - none in place now, but they will appear in this array
    // Need to know if all effects are additive or if some exclude others
    // I.e does 'default' go away when setting another effect?
    // If all additive, you can reason that if this is empty, use default
    const effects: BeaterEffects[] = beater.effects;

    // For passing this data to your classes:
    // Make STSquare a property of this class: private sound: STSquare = new STQuare() above
    // Then you can do here:
    // this.sound.triggerImpact(shapeScale, impactStrength, effects);
  }

  public checkCollision(beater: Beater) {
    const collides = PlayerUtils.circleToSquareCollision(beater, this);
    if (collides) {
      this.playSound(beater);
    }
  }

  public setScale(scale: number) {
    super.setScale(scale);
    this.size *= scale;
  }
}
