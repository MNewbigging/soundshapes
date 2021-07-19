import * as THREE from 'three';

import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Beater } from '../common/types/shapes/Beater';
import { Shape, ShapeType } from '../common/types/shapes/Shape';
import { RandomId } from '../utils/RandomId';
import { GameScene } from './GameScene';
import { EditorUtils } from './EditorUtils';

enum EditStates {
  IDLE = 'idle',
  ADDING_SHAPE = 'adding-shape',
}

export class GameEditor {
  public readonly shapes: Shape[] = [];
  private gameScene: GameScene;
  private editState = EditStates.IDLE;
  private mouseShape?: Shape;
  private mousePos = new THREE.Vector3();
  private selectedShape?: Shape;
  private selectedShapeOutline?: THREE.LineSegments;

  constructor(gameScene: GameScene) {
    this.gameScene = gameScene;

    eventManager.registerEventListener(EventType.START_ADD_SHAPE, this.startAddShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
    eventManager.registerEventListener(EventType.REPOSITION_SHAPE, this.onChangePosition);

    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);
  }

  public activate() {
    // Add listeners we need while editing
    this.addListeners();

    // Show beater directions
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.showDirectionLine(this.gameScene.scene);
      });
    }
  }

  public deactivate() {
    // Remove listeners we don't need while playing
    this.removeListeners();

    // Remove beater direction lines
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.hideDirectionLine(this.gameScene.scene);
      });
    }
  }

  public update = () => {
    // If adding an object, update position of the mouse element
    if (this.editState === EditStates.ADDING_SHAPE) {
      if (this.mouseShape) {
        // Do this 'manually' (not in shape class) to avoid computing bounding box each tick
        this.mouseShape.mesh.position.set(this.mousePos.x, this.mousePos.y, 0);
      }
    }
  };

  private addListeners() {
    this.gameScene.renderer.domElement.onclick = this.onClickCanvas;
  }

  private removeListeners() {
    this.gameScene.renderer.domElement.onclick = undefined;
  }

  private readonly startAddShape = (event: GameEvent) => {
    // Can't add multiple at once
    if (this.editState === EditStates.ADDING_SHAPE) {
      return;
    }
    // Ensures event type is correct to proceed
    if (event.e !== EventType.START_ADD_SHAPE) {
      return;
    }

    // Start tracking mouse
    window.addEventListener('mousemove', this.setMousePosition);

    // Make the new shape
    const shape = EditorUtils.createShape(RandomId.createId(), event.shapeType);

    // Add to scene, save ref to object, update scene state
    shape.addToScene(this.gameScene.scene);
    this.mouseShape = shape;
    this.editState = EditStates.ADDING_SHAPE;
  };

  private readonly cancelAddShape = () => {
    if (this.editState !== EditStates.ADDING_SHAPE) {
      return;
    }

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);

    if (!this.mouseShape) {
      return;
    }

    // Remove the mouse object from the scene
    this.gameScene.scene.remove(this.mouseShape.mesh);
    // Lose ref to mouse object
    this.mouseShape = undefined;
    // Update scene state
    this.editState = EditStates.IDLE;
    // Fire cancellation event
    eventManager.fire({ e: EventType.CANCEL_ADD });
  };

  private readonly onClickCanvas = (e: MouseEvent) => {
    // Determine action based on current state
    switch (this.editState) {
      case EditStates.IDLE:
        // Set mouse position first
        this.setMousePosition(e);

        // Did user select a shape?
        const clickedShape = EditorUtils.clickedShape(this.shapes, this.mousePos);
        if (clickedShape) {
          this.selectShape(clickedShape);
        } else {
          this.deselectShape();
        }

        break;
      case EditStates.ADDING_SHAPE:
        this.addShape();
        break;
    }
  };

  private addShape() {
    if (!this.mouseShape) {
      return;
    }

    // Set the new position
    this.mouseShape.setPosition(this.mousePos);

    // Ensure this new shape doesn't intersect any others in the scene
    this.mouseShape.mesh.geometry.computeBoundingBox();
    for (const shape of this.shapes) {
      const intersects = EditorUtils.meshesIntersectAABB(this.mouseShape.mesh, shape.mesh);
      if (intersects) {
        // TODO - should have some visual cue to say the placement didn't work
        console.log('cannot place on top of other shapes');
        return;
      }
    }

    // Ensure it isn't out of bounds
    if (EditorUtils.meshOutOfBounds(this.mouseShape.mesh, this.gameScene.sceneLimits)) {
      return;
    }

    // If a beater, show direction line now
    if (this.mouseShape.type === ShapeType.BEATER) {
      const beater = this.mouseShape as Beater;
      beater.updateDirectionLine();
      beater.showDirectionLine(this.gameScene.scene);
    }

    // Add to shapes pool
    this.shapes.push(this.mouseShape);

    // Remove reference to it, update state, fire addition event
    this.mouseShape = undefined;
    this.editState = EditStates.IDLE;
    eventManager.fire({ e: EventType.ADD_SHAPE });

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.setMousePosition);
  }

  private selectShape(shape: Shape) {
    // Ensure we didn't re-select same shape
    if (shape.id === this.selectedShape?.id) {
      return;
    }

    this.deselectShape();

    this.selectedShape = shape;

    // Outline the shape
    const edges = new THREE.EdgesGeometry(shape.mesh.geometry);
    const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    outline.position.set(shape.mesh.position.x, shape.mesh.position.y, 0);
    this.selectedShapeOutline = outline;
    this.gameScene.scene.add(outline);

    eventManager.fire({ e: EventType.SELECT_SHAPE, shape });
  }

  private readonly onDeselectShape = (_event: GameEvent) => {
    this.deselectShape();
  };

  private deselectShape() {
    if (this.selectedShape) {
      this.gameScene.scene.remove(this.selectedShapeOutline);
      this.selectedShapeOutline = undefined;
      this.selectedShape = undefined;
      eventManager.fire({ e: EventType.DESELECT_SHAPE });
    }
  }

  private readonly onChangePosition = (event: GameEvent) => {
    if (event.e !== EventType.REPOSITION_SHAPE || !this.selectedShape) {
      return;
    }

    const newPos = event.newPos;
    const oldPos = new THREE.Vector3().copy(this.selectedShape.mesh.position);

    // First, move shape to new position
    this.selectedShape.setPosition(newPos);

    // Check new pos against screen bounds
    if (EditorUtils.meshOutOfBounds(this.selectedShape.mesh, this.gameScene.sceneLimits)) {
      console.log('out of bounds');
      this.selectedShape.setPosition(oldPos);
      return;
    }

    // Then, check for collisions - if any, move it back
    const others = this.shapes.filter((shape) => shape.id !== this.selectedShape.id);
    const collides = EditorUtils.shapeIntersectsOthers(this.selectedShape, others);

    if (collides) {
      this.selectedShape.setPosition(oldPos);
    } else {
      // Adjust selected shape outline too
      this.selectedShapeOutline.position.set(newPos.x, newPos.y, 0);
    }
  };

  private readonly setMousePosition = (e: MouseEvent) => {
    // Get mouse position relative to game canvas
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);
    vec.unproject(this.gameScene.camera);
    vec.sub(this.gameScene.camera.position).normalize();
    const dist = -this.gameScene.camera.position.z / vec.z;
    vec.multiplyScalar(dist);
    vec.z = 0;
    this.mousePos = vec;
  };
}
