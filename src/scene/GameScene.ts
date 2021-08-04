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
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight - 1);
    this.renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.cameraFov,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, this.cameraDepth);
    this.camera.lookAt(0, 0, 0);

    // Calculate screen limits
    this.sceneLimits = SceneUtils.calculateScreenLimits(0, this.camera);

    // Create the scene
    this.scene = new THREE.Scene();

    // Add lighting
    // const color = new THREE.Color('#b1e1ff');
    // const groundCol = new THREE.Color('#b92056');
    // const intensity = 1;
    // const light = new THREE.HemisphereLight(color, groundCol, intensity);
    // this.scene.add(light);

    window.addEventListener('resize', this.onWindowResize);
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

  private readonly onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight - 1);
  };
}
