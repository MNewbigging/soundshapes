import * as THREE from 'three';

import { screenLimits } from './GameUtils';

type UpdateLoop = () => void;

export class GameScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private updateLoop: UpdateLoop = () => {};

  constructor() {
    // Setup the scene
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      screenLimits.fov,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

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
