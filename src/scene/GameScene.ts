import * as THREE from 'three';

import { eventManager, EventParams, EventType } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Shape } from '../common/types/Shapes';
import { RandomId } from '../utils/RandomId';
import { GameUtils } from './GameUtils';

enum GameSceneStates {
  IDLE = 'idle',
  ADDING_SHAPE = 'adding-shape',
}

export class GameScene {
  private sceneState = GameSceneStates.IDLE;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private readonly objects = new Map<string, THREE.Mesh>();
  private mouseObjectId = '';
  private mousePos = new THREE.Vector3();

  constructor() {
    eventManager.registerEventListener(EventType.START_ADD_SHAPE, this.startAddShape);
    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);

    this.setupSceneBasics();
    this.gameLoop();
  }

  public startAddShape = (eventParams: EventParams) => {
    // Determine which shape to make from params
    if (!eventParams.shape) {
      return;
    }

    let shapeMesh: THREE.Mesh;
    switch (eventParams.shape) {
      case Shape.BEATER:
        shapeMesh = GameUtils.createBeaterShape();
        break;
      default:
        return;
    }

    shapeMesh.position.set(0, 0, 2);
    this.scene.add(shapeMesh);

    const newId = RandomId.createId();
    this.mouseObjectId = newId;
    this.objects.set(newId, shapeMesh);
    this.sceneState = GameSceneStates.ADDING_SHAPE;
  };

  private setupSceneBasics() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.domElement.onclick = this.onClickCanvas;
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
  }

  private readonly cancelAddShape = () => {
    // On escape press, stop adding a shape
    window.removeEventListener('mousemove', this.onMouseMove);

    const toRemove = this.objects.get(this.mouseObjectId);
    if (!toRemove) {
      return;
    }

    this.scene.remove(toRemove);
    this.mouseObjectId = '';
    eventManager.fire(EventType.CANCEL_ADD);
  };

  private readonly onClickCanvas = (e: MouseEvent) => {
    // Determine action based on current state
    switch (this.sceneState) {
      case GameSceneStates.IDLE:
        console.log('testing for select shape');
        // Set mouse position
        this.onMouseMove(e);
        // Determine if clicked on shape
        for (const mesh of Array.from(this.objects.values())) {
          const box = new THREE.Box3();
          box.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
          if (box.containsPoint(this.mousePos)) {
            console.log('clicked on mesh!');
          }
        }
        break;
      case GameSceneStates.ADDING_SHAPE:
        this.addShape();
        break;
    }
  };

  private addShape() {
    // TODO - can only place shape if there is space for it

    // Get the shape we're adding
    const shape = this.objects.get(this.mouseObjectId);
    if (!shape) {
      return;
    }

    // Place it in the scene
    shape.position.set(this.mousePos.x, this.mousePos.y, 0);
    shape.geometry.computeBoundingBox();

    // No longer adding a shape
    this.mouseObjectId = '';
    this.sceneState = GameSceneStates.IDLE;
    eventManager.fire(EventType.ADD_SHAPE);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  // ########### GAME LOOP / UPDATE ###########

  private readonly gameLoop = () => {
    requestAnimationFrame(this.gameLoop);

    this.update();

    this.renderer.render(this.scene, this.camera);
  };

  private update() {
    // If adding an object, update position of the mouse element
    if (this.sceneState === GameSceneStates.ADDING_SHAPE) {
      window.addEventListener('mousemove', this.onMouseMove);

      const mouseObj = this.objects.get(this.mouseObjectId);
      if (!mouseObj) {
        return;
      }

      mouseObj.position.set(this.mousePos.x, this.mousePos.y, 0);
    }
  }

  private readonly onMouseMove = (e: MouseEvent) => {
    // Get mouse position relative to game canvas
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    const dist = -this.camera.position.z / vec.z;
    vec.multiplyScalar(dist);
    vec.z = 0;
    this.mousePos = vec;
  };
}
