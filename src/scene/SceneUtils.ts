import * as THREE from 'three';
import { SceneLimits } from './GameScene';

export class SceneUtils {
  public static calculateScreenLimits(depth: number, camera: THREE.PerspectiveCamera): SceneLimits {
    // Calculate visible height
    const cameraOffset = camera.position.z;

    if (depth < cameraOffset) {
      depth -= cameraOffset;
    } else {
      depth += cameraOffset;
    }

    // Vertical fov in radians
    const vFov = (camera.fov * Math.PI) / 180;

    // Math.abs to ensure result always positive
    let visHeight = 2 * Math.tan(vFov / 2) * Math.abs(depth);

    let visWidth = visHeight * camera.aspect;

    // Halve each since origin is from the center
    visHeight *= 0.5;
    visWidth *= 0.5;

    // Round to 1dp to make further calculations easier
    visWidth = Math.round(visWidth * 10) / 10;
    visHeight = Math.round(visHeight * 10) / 10;

    return { xMax: visWidth, yMax: visHeight };
  }
}
