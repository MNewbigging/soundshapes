import * as THREE from 'three';

import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Beater, Shape, ShapeType } from '../common/types/Shapes';
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
  private readonly shapes: Shape[] = [];
  private mouseShape?: Shape;
  private mousePos = new THREE.Vector3();
  private selectedShape?: Shape;

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

  private readonly startAddShape = (event: GameEvent) => {
    // Can't add multiple at once
    if (this.sceneState === GameSceneStates.ADDING_SHAPE) {
      return;
    }
    // Ensures event type is correct to proceed
    if (event.e !== EventType.START_ADD_SHAPE) {
      return;
    }

    // Start tracking mouse
    window.addEventListener('mousemove', this.setMousePosition);

    // Make the shape class for the given shape type
    let shape: Shape;
    switch (event.shapeType) {
      case ShapeType.BEATER:
        shape = new Beater(event.shapeType, GameUtils.createBeaterShape());
        break;
      default:
        return;
    }

    // Add to scene, save ref to object, update scene state
    this.scene.add(shape.mesh);
    this.mouseShape = shape;
    this.sceneState = GameSceneStates.ADDING_SHAPE;
  };

  private readonly cancelAddShape = () => {
    if (this.sceneState !== GameSceneStates.ADDING_SHAPE) {
      return;
    }

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);

    if (!this.mouseShape) {
      return;
    }

    // Remove the mouse object from the scene
    this.scene.remove(this.mouseShape.mesh);
    // Lose ref to mouse object
    this.mouseShape = undefined;
    // Update scene state
    this.sceneState = GameSceneStates.IDLE;
    // Fire cancellation event
    eventManager.fire({ e: EventType.CANCEL_ADD });
  };

  private readonly onClickCanvas = (e: MouseEvent) => {
    // Determine action based on current state
    switch (this.sceneState) {
      case GameSceneStates.IDLE:
        // Set mouse position first
        this.setMousePosition(e);
        for (const shape of this.shapes) {
          if (GameUtils.meshContainsPoint(shape.mesh, this.mousePos)) {
            console.log('selected shape: ', shape.type);
            this.selectShape(shape);
            break;
          }
        }
        break;
      case GameSceneStates.ADDING_SHAPE:
        this.addShape();
        break;
    }
  };

  private addShape() {
    if (!this.mouseShape) {
      return;
    }

    // Ensure this new shape doesn't intersect any others in the scene
    this.mouseShape.mesh.geometry.computeBoundingBox();
    for (const shape of this.shapes) {
      const intersects = GameUtils.meshesIntersectAABB(this.mouseShape.mesh, shape.mesh);
      if (intersects) {
        // TODO - should have some visual cue to say the placement didn't work
        console.log('cannot place on top of other shapes');
        return;
      }
    }

    // Place in scene, create bounding box
    this.mouseShape.mesh.position.set(this.mousePos.x, this.mousePos.y, 0);
    this.mouseShape.mesh.geometry.computeBoundingBox();

    // Add mouse object to objects map
    this.shapes.push(this.mouseShape);

    // Remove reference to it, update state, fire addition event
    this.mouseShape = undefined;
    this.sceneState = GameSceneStates.IDLE;
    eventManager.fire({ e: EventType.ADD_SHAPE });
    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);
  }

  private selectShape(shape: Shape) {
    this.selectedShape = shape;
    // Fire selection event
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
      if (this.mouseShape) {
        this.mouseShape.mesh.position.set(this.mousePos.x, this.mousePos.y, 0);
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
