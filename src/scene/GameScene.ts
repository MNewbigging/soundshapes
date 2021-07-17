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
  private mouseObject?: THREE.Mesh;
  private mousePos = new THREE.Vector3();

  constructor() {
    eventManager.registerEventListener(EventType.START_ADD_SHAPE, this.startAddShape);
    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);

    this.setupSceneBasics();
    this.gameLoop();
  }

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

  private readonly startAddShape = (eventParams: EventParams) => {
    if (this.sceneState === GameSceneStates.ADDING_SHAPE) {
      return;
    }

    // Determine which shape to make from params
    if (!eventParams.shape) {
      return;
    }

    // Start tracking mouse
    window.addEventListener('mousemove', this.setMousePosition);

    // Make a mesh for the given shape
    let shapeMesh: THREE.Mesh;
    switch (eventParams.shape) {
      case Shape.BEATER:
        shapeMesh = GameUtils.createBeaterShape();
        break;
      default:
        return;
    }

    // Add to scene, save ref to object, update scene state
    this.scene.add(shapeMesh);
    this.mouseObject = shapeMesh;
    this.sceneState = GameSceneStates.ADDING_SHAPE;
  };

  private readonly cancelAddShape = () => {
    if (this.sceneState !== GameSceneStates.ADDING_SHAPE) {
      return;
    }

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);

    if (!this.mouseObject) {
      return;
    }

    // Remove the mouse object from the scene
    this.scene.remove(this.mouseObject);
    // Lose ref to mouse object
    this.mouseObject = undefined;
    // Update scene state
    this.sceneState = GameSceneStates.IDLE;
    // Fire cancellation event
    eventManager.fire(EventType.CANCEL_ADD);
  };

  private readonly onClickCanvas = (e: MouseEvent) => {
    // Determine action based on current state
    switch (this.sceneState) {
      case GameSceneStates.IDLE:
        console.log('testing for select shape');
        // Set mouse position
        this.setMousePosition(e);
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
    if (!this.mouseObject) {
      return;
    }

    // Ensure this new shape doesn't intersect any others in the scene
    // for (const mesh of Array.from(this.objects.values())) {
    //   const intersects = shape.geometry.boundingBox.intersectsBox(mesh.geometry.boundingBox);
    //   if (intersects) {
    //     console.log('cannot place on top of other shapes');
    //     return;
    //   }
    // }

    // Place in scene, create bounding box
    this.mouseObject.position.set(this.mousePos.x, this.mousePos.y, 0);
    this.mouseObject.geometry.computeBoundingBox();

    // Add mouse object to objects map
    const newId = RandomId.createId();
    this.objects.set(newId, this.mouseObject);

    // Remove reference to it, update state, fire addition event
    this.mouseObject = undefined;
    this.sceneState = GameSceneStates.IDLE;
    eventManager.fire(EventType.ADD_SHAPE);
    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);
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
      if (this.mouseObject) {
        this.mouseObject.position.set(this.mousePos.x, this.mousePos.y, 0);
      }
    }
  }

  private readonly setMousePosition = (e: MouseEvent) => {
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
