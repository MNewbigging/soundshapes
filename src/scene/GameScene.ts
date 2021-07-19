import * as THREE from 'three';
import { SceneUtils } from './SceneUtils';

export interface SceneLimits {
  xMax: number;
  yMax: number;
}

type UpdateLoop = () => void;

export class GameScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public sceneLimits: SceneLimits = {
    xMax: window.innerWidth,
    yMax: window.innerHeight - 1,
  };

  private readonly cameraFov = 60;
  private readonly cameraDepth = 100;

  private updateLoop: UpdateLoop = () => {};

  constructor() {
    // Setup the scene
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight - 1);
    this.renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      this.cameraFov,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, this.cameraDepth);
    this.camera.lookAt(0, 0, 0);

    this.sceneLimits = SceneUtils.calculateScreenLimits(0, this.camera);

    this.scene = new THREE.Scene();
  }

  public start() {
    this.gameLoop();
  }

  public setUpdateLoop(loop: UpdateLoop) {
    this.updateLoop = loop;
  }

  private readonly gameLoop = () => {
    requestAnimationFrame(this.gameLoop);

    this.updateLoop();

    this.renderer.render(this.scene, this.camera);
  };
}
